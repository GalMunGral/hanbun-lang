export class Ok<T> {
  constructor(public value: T, public next: string) {}
}
export class Err<T> {
  constructor(public message: T, public next: string) {}
}

class Error<A, E> {
  constructor(public ok: A, public err: E) {}
  public map<B>(f: (_: A) => B): Error<B, E> {
    return this.err != null
      ? new Error(undefined, this.err)
      : new Error(f(this.ok), undefined);
  }
  public bind<B>(f: (_: A) => Error<B, E>): Error<B, E> {
    return this.err != null ? new Error(undefined, this.err) : f(this.ok);
  }
}

type Result<T = any> = Error<Ok<T>, Err<string>>;
type ParseFn<T> = (s: string) => Result<T>;
type Apply<A, B> = A extends (b: B) => infer C ? C : never;

export class Parser<T> {
  static ok<T>(value: T, next: string): Result<T> {
    return new Error(new Ok(value, next), undefined);
  }
  static err(message: string, next: string): Result {
    return new Error(undefined, new Err(message, next));
  }
  static pure<T>(value: T): Parser<T> {
    return new Parser<T>((s) => Parser.ok(value, s));
  }
  static noop<T>(): Parser<T> {
    return new Parser<T>((s) => Parser.err("", s));
  }

  private cache = new Map<string, Result<T>>();
  public parse: ParseFn<T>;

  constructor(parse: ParseFn<T>) {
    this.parse = (s: string) => {
      if (!this.cache.has(s)) {
        this.cache.set(s, parse(s));
      }
      return this.cache.get(s)!;
    };
  }

  public tap(fn: (res: T) => void) {
    return new Parser<T>((s) =>
      this.parse(s).map((ok) => {
        fn(ok.value);
        return new Ok(ok.value, ok.next);
      })
    );
  }

  public map<U>(fn: (a: T) => U) {
    return new Parser<U>((s) =>
      this.parse(s).map((ok) => new Ok(fn(ok.value), ok.next))
    );
  }

  public or<T1>(next: () => Parser<T1>) {
    return new Parser<T | T1>((s) => {
      const res = this.parse(s);
      if (res.ok) return res;
      return next().parse(s);
    });
  }

  public apl<U>(next: Parser<U>) {
    return new Parser<T>((s) =>
      this.parse(s).bind((ok1) =>
        next.parse(ok1.next).bind((ok2) => {
          return Parser.ok(ok1.value, ok2.next);
        })
      )
    );
  }

  public apr<U>(next: Parser<U>) {
    return new Parser<U>((s) =>
      this.parse(s).bind((ok1) =>
        next.parse(ok1.next).bind((ok2) => {
          return Parser.ok(ok2.value, ok2.next);
        })
      )
    );
  }

  public ap<U>(next: Parser<U>) {
    return new Parser<Apply<T, U>>((s) =>
      this.parse(s).bind((ok1) =>
        next.parse(ok1.next).bind((ok2) => {
          if (typeof ok1.value != "function")
            return Parser.err(`${ok1.value} is not a function`, ok2.next);
          try {
            return Parser.ok(ok1.value(ok2.value), ok2.next);
          } catch (e: any) {
            return Parser.err(e.message, ok2.next);
          }
        })
      )
    );
  }

  public many(): Parser<T[]> {
    return new Parser<T[]>((s) => {
      const res = this.parse(s);
      if (res.err) return Parser.ok([], s);
      return res.bind((ok1) =>
        this.many()
          .parse(ok1.next)
          .bind((ok2) => Parser.ok([ok1.value, ...ok2.value], ok2.next))
      );
    });
  }

  public sep<U>(separator: Parser<U>): Parser<T[]> {
    return Parser.noop<T[]>()
      .or(() =>
        Parser.pure((head: T) => (tail: T[]) => [head, ...tail])
          .ap(this)
          .ap(separator.apr(this).many())
      )
      .or(() => Parser.pure([]));
  }
}
