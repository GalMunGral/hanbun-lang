export class Ok<T> {
  constructor(public value: T, public next: string) {}
}

export class Err<E> {
  static last: Err<unknown>;
  constructor(public error: E, public next: string) {
    if (Err.last == null || next.length <= Err.last.next.length) {
      Err.last = this;
    }
  }
}

type ParseFn<T, E> = (s: string) => Ok<T> | Err<E>;
type Apply<A, B> = A extends (b: B) => infer C ? C : never;

export class Parser<T, E = Error> {
  public parse: ParseFn<T, E>;
  private cache = new Map<string, Ok<T> | Err<E>>();

  constructor(parse: ParseFn<T, E>) {
    this.parse = (s: string) => {
      if (!this.cache.has(s)) {
        this.cache.set(s, parse(s));
      }
      return this.cache.get(s)!;
    };
  }

  public tap(fn: (res: T) => void) {
    return new Parser<T, E>((s) => {
      const res = this.parse(s);
      if (res instanceof Err) return res;
      fn(res.value);
      return res;
    });
  }

  public map<U>(fn: (a: T) => U) {
    return new Parser<U, E>((s) => {
      const res = this.parse(s);
      if (res instanceof Err) return res;
      return new Ok(fn(res.value), res.next);
    });
  }

  public or<T1, E1>(next: () => Parser<T1, E1>) {
    return new Parser<T | T1, E1>((s) => {
      const res = this.parse(s);
      if (res instanceof Ok) return res;
      return next().parse(s);
    });
  }

  public apl<U, E1>(next: Parser<U, E1>) {
    return new Parser<T, E | E1>((s) => {
      const left = this.parse(s);
      if (left instanceof Err) return left;
      const right = next.parse(left.next);
      if (right instanceof Err) return right;
      return new Ok(left.value, right.next);
    });
  }

  public apr<U, E1>(next: Parser<U, E1>) {
    return new Parser<U, E | E1>((s) => {
      const left = this.parse(s);
      if (left instanceof Err) return left;
      const right = next.parse(left.next);
      if (right instanceof Err) return right;
      return new Ok(right.value, right.next);
    });
  }

  public ap<U, E1>(next: Parser<U, E1>) {
    return new Parser<Apply<T, U>, E | E1 | string>((s) => {
      const left = this.parse(s);
      if (left instanceof Err) return left;
      const right = next.parse(left.next);
      if (right instanceof Err) return right;
      return typeof left.value != "function"
        ? new Err("${left.value} is not a function", left.next)
        : new Ok<Apply<T, U>>(left.value(right.value), right.next);
    });
  }

  public many() {
    return new Parser<T[], E>((s) => {
      const parsed: T[] = [];
      let res: Ok<T> | Err<E>;
      while ((res = this.parse(s)) instanceof Ok) {
        parsed.push(res.value);
        s = res.next;
      }
      return new Ok(parsed, s);
    });
  }

  public sep<U, E1>(separator: Parser<U, E1>): Parser<T[], E | E1> {
    return fail
      .or(() =>
        pure((head: T) => (tail: T[]) => [head, ...tail])
          .ap(this)
          .ap(separator.apr(this).many())
      )
      .or(() => pure([])) as Parser<T[], E | E1>;
  }
}

export const fail = new Parser<any, null>((s) => new Err(null, s));

export const pure = <T>(value: T) =>
  new Parser<T, any>((s) => new Ok(value, s));
