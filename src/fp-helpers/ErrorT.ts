import { Monad, MonadImpl } from "./types.js";

type ErrorOps<E, M> = {
  err(s: E): Monad<ErrorT<E, M>, any>;
};

export class ErrorT<E, M> {
  private constructor(public run: Monad<M, { err?: E; ok?: any }>) {}

  static lift<E, M, A>(
    m: Monad<M, A>
  ): Monad<ErrorT<E, M>, A> & ErrorOps<E, M> {
    return {
      data: new ErrorT<E, M>(m.bind((v) => m.unit({ err: undefined, ok: v }))),
      ...ErrorT.trans<any, M, any>(m),
    };
  }

  static trans<E, M, A>(
    m: MonadImpl<M, A>
  ): MonadImpl<ErrorT<E, M>, A> & ErrorOps<E, M> {
    return {
      unit(v) {
        return {
          data: new ErrorT<E, M>(m.unit({ err: undefined, ok: v })),
          ...ErrorT.trans<any, M, any>(m),
        };
      },
      err(e) {
        return {
          data: new ErrorT(m.unit({ err: e, ok: undefined })),
          ...ErrorT.trans<any, M, any>(m),
        };
      },
      bind(f) {
        return {
          data: new ErrorT(
            this.data.run.bind((v) => {
              if (v.err) {
                console.log(v.err);
              }
              return v.err ? m.unit(v) : f(v.ok).data.run;
            })
          ),
          ...ErrorT.trans<any, M, any>(m),
        };
      },
    };
  }
}
