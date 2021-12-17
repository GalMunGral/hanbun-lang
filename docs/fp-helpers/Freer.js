// F really should be F<_>, i.e. a kind-2 type,
// which doesn't exist in TS yet.
export class Functor {
    eff;
    cont;
    constructor(eff, cont) {
        this.eff = eff;
        this.cont = cont;
    }
    map(f) {
        return new Functor(this.eff, (a) => f(this.cont(a)));
    }
}
export class Pure {
    value;
    constructor(value) {
        this.value = value;
    }
    map(f) {
        return new Pure(f(this.value));
    }
    bind(f) {
        return f(this.value);
    }
}
export class Impure {
    functor;
    constructor(functor) {
        this.functor = functor;
    }
    map(f) {
        return new Impure(this.functor.map((monad) => monad.map(f)));
    }
    bind(f) {
        return new Impure(this.functor.map((monad) => monad.bind(f)));
    }
}
export function isEff(o) {
    return o instanceof Pure || o instanceof Impure;
}
export function eff(e) {
    return new Impure(new Functor(e, (x) => new Pure(x)));
}
