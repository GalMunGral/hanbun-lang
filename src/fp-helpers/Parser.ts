import { Monad } from "./types.js";
import { Error } from "./Error.js";

class Ok<T> {
  constructor(public value: T, public next: string) {}
}

export class Err {
  constructor(public message: string, public next: string) {}
}

type Result<T> = Monad<Error<Err>, Ok<T>>;
type ParseFn<T> = (s: string) => Result<T>;
type Apply<A, B> = A extends (b: B) => infer C ? C : never;

export class Parser<T> {
  static err<T>(msg: string, next: string) {
    return Error.instance<Err, Ok<T>>().err(new Err(msg, next));
  }
  static ok<T>(val: T, next: string): Result<T> {
    return Error.instance<Err, Ok<T>>().unit(new Ok(val, next));
  }
  static pure<T>(value: T) {
    return new Parser<T>((s) => Parser.ok(value, s));
  }
  static noop<T>() {
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
      this.parse(s).bind((ok) => {
        fn(ok.value);
        return Parser.ok(ok.value, ok.next);
      })
    );
  }

  public map<U>(fn: (a: T) => U) {
    return new Parser<U>((s) =>
      this.parse(s).bind((ok) => Parser.ok(fn(ok.value), ok.next))
    );
  }

  public or<T1>(next: () => Parser<T1>) {
    return new Parser<T | T1>((s) => {
      const res = this.parse(s);
      if (res.data.ok) return res;
      return next().parse(s);
    });
  }

  public apl<U>(next: Parser<U>) {
    return new Parser<T>((s) =>
      this.parse(s).bind((ok1) =>
        next.parse(ok1.next).bind((ok2) => Parser.ok(ok1.value, ok2.next))
      )
    );
  }

  public apr<U>(next: Parser<U>) {
    return new Parser<U>((s) =>
      this.parse(s).bind((ok1) =>
        next.parse(ok1.next).bind((ok2) => Parser.ok(ok2.value, ok2.next))
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
      if (res.data.err) return Parser.ok([], s);
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
