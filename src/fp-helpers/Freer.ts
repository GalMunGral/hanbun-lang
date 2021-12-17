// F really should be F<_>, i.e. a kind-2 type,
// which doesn't exist in TS yet.

export class Functor<F = any, A = any, B = any> {
  constructor(public eff: F, public cont: (_: A) => B) {}
  public map<C>(f: (_: B) => C): Functor<F, A, C> {
    return new Functor(this.eff, (a) => f(this.cont(a)));
  }
}

export class Pure<A = any> {
  constructor(public value: A) {}
  public map<B>(f: (_: A) => B): Eff<B> {
    return new Pure(f(this.value));
  }
  public bind<B>(f: (_: A) => Eff<B>): Eff<B> {
    return f(this.value);
  }
}

export class Impure<F = any, A = any, B = any> {
  constructor(public functor: Functor<F, A, Eff<B>>) {}
  public map<C>(f: (_: B) => C): Eff<C> {
    return new Impure(this.functor.map((monad) => monad.map(f)));
  }
  public bind<C>(f: (_: B) => Eff<C>): Eff<C> {
    return new Impure(this.functor.map((monad) => monad.bind(f)));
  }
}

export type Eff<T = any> = Pure<T> | Impure<any, any, T>;

export function isEff(o: any): o is Eff {
  return o instanceof Pure || o instanceof Impure;
}

export function eff<F>(e: F) {
  return new Impure(new Functor(e, (x) => new Pure(x)));
}
