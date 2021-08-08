export class Ok {
    value;
    next;
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}
export class Err {
    error;
    next;
    static last;
    constructor(error, next) {
        this.error = error;
        this.next = next;
        if (Err.last == null || next.length <= Err.last.next.length) {
            Err.last = this;
        }
    }
}
export class Parser {
    parse;
    cache = new Map();
    constructor(parse) {
        this.parse = (s) => {
            if (!this.cache.has(s)) {
                this.cache.set(s, parse(s));
            }
            return this.cache.get(s);
        };
    }
    tap(fn) {
        return new Parser((s) => {
            const res = this.parse(s);
            if (res instanceof Err)
                return res;
            fn(res.value);
            return res;
        });
    }
    map(fn) {
        return new Parser((s) => {
            const res = this.parse(s);
            if (res instanceof Err)
                return res;
            return new Ok(fn(res.value), res.next);
        });
    }
    or(next) {
        return new Parser((s) => {
            const res = this.parse(s);
            if (res instanceof Ok)
                return res;
            return next().parse(s);
        });
    }
    apl(next) {
        return new Parser((s) => {
            const left = this.parse(s);
            if (left instanceof Err)
                return left;
            const right = next.parse(left.next);
            if (right instanceof Err)
                return right;
            return new Ok(left.value, right.next);
        });
    }
    apr(next) {
        return new Parser((s) => {
            const left = this.parse(s);
            if (left instanceof Err)
                return left;
            const right = next.parse(left.next);
            if (right instanceof Err)
                return right;
            return new Ok(right.value, right.next);
        });
    }
    ap(next) {
        return new Parser((s) => {
            const left = this.parse(s);
            if (left instanceof Err)
                return left;
            const right = next.parse(left.next);
            if (right instanceof Err)
                return right;
            return typeof left.value != "function"
                ? new Err("${left.value} is not a function", left.next)
                : new Ok(left.value(right.value), right.next);
        });
    }
    many() {
        return new Parser((s) => {
            const parsed = [];
            let res;
            while ((res = this.parse(s)) instanceof Ok) {
                parsed.push(res.value);
                s = res.next;
            }
            return new Ok(parsed, s);
        });
    }
    sep(separator) {
        return fail
            .or(() => pure((head) => (tail) => [head, ...tail])
            .ap(this)
            .ap(separator.apr(this).many()))
            .or(() => pure([]));
    }
}
export const fail = new Parser((s) => new Err(null, s));
export const pure = (value) => new Parser((s) => new Ok(value, s));
