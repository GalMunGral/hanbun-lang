import { Eff, Pure } from "./fp-helpers/Freer.js";

export class NOOP {}
export class ERROR {
  constructor(public message: string) {}
}
export class PEEK {}
export class POP {}
export class PUSH {
  constructor(public val: any) {}
}
export class BINOP {
  constructor(public op: string, public left: any, public right: any) {}
}
export class GET_ENV {}
export class PUT_ENV {
  constructor(public root: any) {}
}
export class LOOKUP {
  constructor(public path: string[]) {}
}
export class SAFE_LOOKUP {
  constructor(public path: string[]) {}
}
export class UPDATE {
  constructor(public root: any, public path: string[], public value: any) {}
}
export class UPDATE_ROOT {
  constructor(public path: string[], public value: any) {}
}

export function RUN(m: Eff<any>) {
  new Instance().run(m);
}

export class Instance {
  private stack: any[] = [];
  private env: any = window;

  public run(m: Eff<any>) {
    if (m instanceof Pure) return;
    const { eff, cont } = m.functor;
    this.run(cont(this.handle(eff)));
  }

  private handle(
    eff:
      | ERROR
      | PEEK
      | POP
      | PUSH
      | BINOP
      | GET_ENV
      | PUT_ENV
      | LOOKUP
      | SAFE_LOOKUP
      | UPDATE
      | UPDATE_ROOT
  ): any {
    if (eff == NOOP) return;
    if (eff instanceof ERROR) {
      throw eff.message;
    }
    if (eff instanceof POP) {
      return this.stack.pop();
    }
    if (eff instanceof PEEK) {
      if (!this.stack.length) throw "nothing on stack!";
      return this.stack[this.stack.length - 1];
    }
    if (eff instanceof PUSH) {
      this.stack.push(eff.val);
      return;
    }
    if (eff instanceof BINOP) {
      switch (eff.op) {
        case "<":
          return eff.left < eff.right;
        case "<=":
          return eff.left <= eff.right;
        case ">":
          return eff.left > eff.right;
        case ">=":
          return eff.left >= eff.right;
        case "==":
          return eff.left === eff.right;
        case "+":
          return eff.left + eff.right;
        case "-":
          return eff.left - eff.right;
        case "*":
          return eff.left * eff.right;
        case "/":
          return eff.left / eff.right;
        case "**":
          return eff.left ** eff.right;
        default:
          console.log("yo");
          throw "Operation Not Supported";
      }
    }
    if (eff instanceof GET_ENV) {
      return this.env;
    }
    if (eff instanceof PUT_ENV) {
      this.env = eff.root;
      return;
    }
    if (eff instanceof LOOKUP) {
      let cur = this.env;
      for (let p of eff.path) {
        if (typeof cur !== "object" || cur === null) return null;
        cur = cur[p];
      }
      return cur;
    }
    if (eff instanceof SAFE_LOOKUP) {
      let cur = this.env;
      for (let p of eff.path) {
        if (typeof cur !== "object" || cur === null)
          throw `${eff.path.join("/")}not found!`;
        cur = cur[p];
      }
      return cur;
    }
    if (eff instanceof UPDATE) {
      if (!eff.path.length) throw "what do you want to update?";
      let key = eff.path[eff.path.length - 1];
      let cur = eff.root;
      for (let p of eff.path.slice(0, -1)) {
        if (typeof cur[p] !== "object" || cur[p] === null) {
          cur[p] = {};
        }
        cur = cur[p];
      }
      cur[key] = eff.value;
      return;
    }
    if (eff instanceof UPDATE_ROOT) {
      if (!eff.path.length) throw "what do you want to update?";
      let key = eff.path[eff.path.length - 1];
      let cur = this.env;
      for (let p of eff.path.slice(0, -1)) {
        if (typeof cur[p] !== "object" || cur[p] === null) {
          cur[p] = {};
        }
        cur = cur[p];
      }
      cur[key] = eff.value;
      return;
    }
    throw eff;
  }
}
