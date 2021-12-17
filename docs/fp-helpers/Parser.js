export class Ok {
    value;
    next;
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}
export class Err {
    message;
    next;
    constructor(message, next) {
        this.message = message;
        this.next = next;
    }
}
class Error {
    ok;
    err;
    constructor(ok, err) {
        this.ok = ok;
        this.err = err;
    }
    map(f) {
        return this.err != null
            ? new Error(undefined, this.err)
            : new Error(f(this.ok), undefined);
    }
    bind(f) {
        return this.err != null ? new Error(undefined, this.err) : f(this.ok);
    }
}
export class Parser {
    static ok(value, next) {
        return new Error(new Ok(value, next), undefined);
    }
    static err(message, next) {
        return new Error(undefined, new Err(message, next));
    }
    static pure(value) {
        return new Parser((s) => Parser.ok(value, s));
    }
    static noop() {
        return new Parser((s) => Parser.err("", s));
    }
    cache = new Map();
    parse;
    constructor(parse) {
        this.parse = (s) => {
            if (!this.cache.has(s)) {
                this.cache.set(s, parse(s));
            }
            return this.cache.get(s);
        };
    }
    tap(fn) {
        return new Parser((s) => this.parse(s).map((ok) => {
            fn(ok.value);
            return new Ok(ok.value, ok.next);
        }));
    }
    map(fn) {
        return new Parser((s) => this.parse(s).map((ok) => new Ok(fn(ok.value), ok.next)));
    }
    or(next) {
        return new Parser((s) => {
            const res = this.parse(s);
            if (res.ok)
                return res;
            return next().parse(s);
        });
    }
    apl(next) {
        return new Parser((s) => this.parse(s).bind((ok1) => next.parse(ok1.next).bind((ok2) => {
            return Parser.ok(ok1.value, ok2.next);
        })));
    }
    apr(next) {
        return new Parser((s) => this.parse(s).bind((ok1) => next.parse(ok1.next).bind((ok2) => {
            return Parser.ok(ok2.value, ok2.next);
        })));
    }
    ap(next) {
        return new Parser((s) => this.parse(s).bind((ok1) => next.parse(ok1.next).bind((ok2) => {
            if (typeof ok1.value != "function")
                return Parser.err(`${ok1.value} is not a function`, ok2.next);
            try {
                return Parser.ok(ok1.value(ok2.value), ok2.next);
            }
            catch (e) {
                return Parser.err(e.message, ok2.next);
            }
        })));
    }
    many() {
        return new Parser((s) => {
            const res = this.parse(s);
            if (res.err)
                return Parser.ok([], s);
            return res.bind((ok1) => this.many()
                .parse(ok1.next)
                .bind((ok2) => Parser.ok([ok1.value, ...ok2.value], ok2.next)));
        });
    }
    sep(separator) {
        return Parser.noop()
            .or(() => Parser.pure((head) => (tail) => [head, ...tail])
            .ap(this)
            .ap(separator.apr(this).many()))
            .or(() => Parser.pure([]));
    }
}
