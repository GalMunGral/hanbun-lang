import { Eff, Pure, eff, isEff } from "./fp-helpers/Freer.js";
import {
  RUN,
  PEEK,
  POP,
  PUSH,
  BINOP,
  GET_ENV,
  PUT_ENV,
  SAFE_LOOKUP,
  UPDATE,
  UPDATE_ROOT,
  NOOP,
} from "./Interpreter.js";

export const COND = (cons: Eff<void>) => (alt: Eff<void>) =>
  eff(new POP()).bind((v) => (Boolean(v) ? cons : alt));

export const HANDLE = (name: string) => (body: Eff<void>) =>
  eff(new PEEK()).bind((target) =>
    new Pure(
      eff(new GET_ENV()).bind((oldEnv) =>
        eff(
          new PUT_ENV({
            __proto__: oldEnv,
            __self__: target,
            document: window.document,
            window: window,
          })
        )
          .bind(() => body)
          .bind(() => eff(new PUT_ENV(oldEnv)))
      )
    ).bind((FUNC: Eff<any>) =>
      // sync methods and async event handlers are treated equally
      eff(new UPDATE(target, [name], FUNC)).bind(() =>
        target instanceof EventTarget
          ? eff(
              new UPDATE(target, ["on" + name], (e: Event) => {
                e?.stopPropagation();
                RUN(eff(new PUSH(e)).bind(() => FUNC));
              })
            )
          : eff(NOOP)
      )
    )
  );

export const SEND_MSG = (path: string[]) => (method: string) =>
  eff(new SAFE_LOOKUP(path))
    .bind((target) =>
      typeof target[method] == "function"
        ? // built-in
          eff(new POP()).bind((arg) => {
            const res = target[method](isEff(arg) ? () => RUN(arg) : arg);
            return eff(new PUSH(res));
          })
        : // user-defined
          (target[method] as Eff<any>)
    )
    .bind(() => eff(new PEEK()));

export const LOAD_VAR = (path: string[]) =>
  eff(new SAFE_LOOKUP(path)).bind((v) => eff(new PUSH(v)));

export const LOAD_CONST = (literal: any) => eff(new PUSH(literal));

export const NODE = (type: string) =>
  eff(NOOP).bind(() => {
    let node: Element;
    switch (type) {
      case "svg":
        node = document.createElementNS("http://www.w3.org/2000/svg", type);
        node.setAttributeNS(
          "http://www.w3.org/2000/xmlns/",
          "xmlns:xlink",
          "http://www.w3.org/1999/xlink"
        );
        break;
      default:
        node = document.createElement(type);
    }
    return eff(new PUSH(node));
  });

export const OPERATE = (op: string) =>
  eff(new POP()).bind((right) =>
    eff(new POP())
      .bind((left) => eff(new BINOP(op, left, right)))
      .bind((res) => eff(new PUSH(res)))
  );

export const STORE_VAR = (path: string[]) =>
  eff(new POP()).bind((value) => eff(new UPDATE_ROOT(path, value)));

export const SETP_VAL = (name: string) => (value: any) =>
  eff(new PEEK()).bind((target) => eff(new UPDATE(target, [name], value)));

export const SETP_VAR = (name: string) => (path: string[]) =>
  eff(new PEEK()).bind((target) =>
    eff(new SAFE_LOOKUP(path)).bind((value) =>
      eff(new UPDATE(target, [name], value))
    )
  );
