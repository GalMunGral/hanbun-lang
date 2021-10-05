import { Monad, MonadImpl } from "./types.js";

type StateOps<S, M> = {
  getState(): Monad<StateT<S, M>, S>;
  putState(s: S): Monad<StateT<S, M>, void>;
  update(f: (s: S) => S): Monad<StateT<S, M>, S>;
};

export class StateT<S, M> {
  private constructor(
    public run: (s: S) => Monad<M, { state: S; value: any }>
  ) {}

  static lift<S, M, A>(
    m: Monad<M, A>
  ): Monad<StateT<S, M>, A> & StateOps<S, M> {
    return {
      data: new StateT((s) =>
        m.bind((v) =>
          m.unit({
            state: s,
            value: v,
          })
        )
      ),
      ...StateT.trans<any, M, any>(m),
    };
  }

  static trans<S, M, A>(
    m: MonadImpl<M, A>
  ): MonadImpl<StateT<S, M>, A> & StateOps<S, M> {
    return {
      unit(value) {
        return {
          data: new StateT((state) =>
            m.unit({
              state,
              value,
            })
          ),
          ...StateT.trans<any, M, any>(m),
        };
      },
      bind(f) {
        return {
          data: new StateT((s) =>
            this.data
              .run(s)
              .bind(({ state, value }) => f(value).data.run(state))
          ),
          ...StateT.trans<any, M, any>(m),
        };
      },
      getState() {
        return {
          data: new StateT((state) =>
            m.unit({
              state,
              value: state,
            })
          ),
          ...StateT.trans<any, M, any>(m),
        };
      },
      putState(s) {
        return {
          data: new StateT(() =>
            m.unit({
              state: s,
              value: undefined,
            })
          ),
          ...StateT.trans<any, M, any>(m),
        };
      },
      update(f) {
        return {
          data: new StateT((s) =>
            m.unit({
              state: f(s),
              value: s,
            })
          ),
          ...StateT.trans<any, M, any>(m),
        };
      },
    };
  }
}
