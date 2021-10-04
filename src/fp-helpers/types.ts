export type Monad<M, V> = MonadImpl<M, V> & { data: M };

export interface MonadImpl<M, A> {
  unit<V>(v: V): Monad<M, V>;
  bind<B>(this: Monad<M, A>, f: (v: A) => Monad<M, B>): Monad<M, B>;
}

export interface MonadTrans<T> {
  lift<M, V>(m: Monad<M, V>): Monad<T, V>;
  trans<M, V>(m: MonadImpl<M, V>): Monad<T, V>;
}
