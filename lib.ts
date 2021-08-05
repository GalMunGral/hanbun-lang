export class Ok<T> {
  constructor(public value: T, public next: string) {}
}

export class Err<E> {
  constructor(public error: E) {}
}

type ParseFn<T, E> = (s: string) => Ok<T> | Err<E>;

export class Parser<T, E = Error> {
  constructor(public parse: ParseFn<T, E>) {}

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
}

export const fail = new Parser<null, null>(() => new Err(null));
