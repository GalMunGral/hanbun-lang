import { MonadImpl } from "./types.js";

export class Identity {
  private constructor(public value: any) {}
  static instance<A>(): MonadImpl<Identity, A> {
    return {
      unit(v) {
        return {
          data: new Identity(v),
          ...Identity.instance<any>(),
        };
      },
      bind(f) {
        return f(this.data.value);
      },
    };
  }
}
