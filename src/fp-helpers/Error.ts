import { Monad, MonadImpl } from "./types.js";

type ErrorOps<E> = {
  err(s: E): Monad<Error<E>, any>;
};

export class Error<E> {
  private constructor(public err?: E, public ok?: any) {}

  static instance<E, A>(): MonadImpl<Error<E>, A> & ErrorOps<E> {
    return {
      unit(v) {
        return {
          data: new Error<E>(undefined, v),
          ...Error.instance(),
        };
      },
      err(e) {
        return {
          data: new Error<E>(e, undefined),
          ...Error.instance(),
        };
      },
      bind(f) {
        return this.data.err != undefined
          ? { data: this.data, ...Error.instance() }
          : f(this.data.ok);
      },
    };
  }
}
