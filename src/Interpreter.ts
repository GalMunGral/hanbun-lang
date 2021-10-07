import { Eff, Pure, eff, noop } from "./fp-helpers/Freer.js";
import {
  run,
  ERROR,
  RESET,
  PEEK,
  POP,
  PUSH,
  GET_ENV,
  PUT_ENV,
  LOOKUP,
  SAFE_LOOKUP,
  UPDATE,
  UPDATE_ROOT,
} from "./VM.js";

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
      eff(new UPDATE(target, [name], FUNC)).bind(() =>
        target instanceof EventTarget
          ? eff(
              new UPDATE(target, ["on" + name], (e: Event) => {
                e?.stopPropagation();
                run(FUNC);
              })
            )
          : noop
      )
    )
  );

export const SEND_MSG = (path: string[]) => (method: string) =>
  eff(new SAFE_LOOKUP(path))
    .bind((target) =>
      typeof target[method] == "function"
        ? // built-in
          eff(new PEEK()).bind((arg) => eff(new PUSH(target[method](arg))))
        : // user-defined
          (target[method] as Eff<any>)
    )
    .bind(() => eff(new PEEK()));

export const LOAD_VAR = (path: string[]) =>
  eff(new SAFE_LOOKUP(path)).bind((v) => eff(new PUSH(v)));

export const RST_VAR = (path: string[]) =>
  eff(new RESET()).bind(() => LOAD_VAR(path));

export const LOAD_CONST = (literal: any) => eff(new PUSH(literal));

export const EVAL = (expr: string) => eff(new PUSH(eval(expr)));

export const NODE = (type: string) =>
  eff(new LOOKUP(["__cursor__"])).bind((cursor: HTMLElement) => {
    const node = document.createElement(type);
    cursor?.append(node);
    return eff(new PUSH(node));
  });

export const APPLY_OP = (op: string) =>
  eff(new POP()).bind((right) =>
    eff(new POP()).bind((left) => {
      try {
        return eff(
          new PUSH(
            eval(`${JSON.stringify(left)} ${op} ${JSON.stringify(right)}`)
          )
        );
      } catch (e: any) {
        return eff(new ERROR(e.message));
      }
    })
  );

export const APPLY_FUNC = (fn: string) =>
  eff(new SAFE_LOOKUP([fn])).bind((f: Function) =>
    eff(new POP()).bind((x) => {
      try {
        return eff(new PUSH(f(x)));
      } catch (e: any) {
        return eff(new ERROR(e.message));
      }
    })
  );

export const STORE_VAR = (path: string[]) =>
  eff(new PEEK()).bind((value) => eff(new UPDATE_ROOT(path, value)));

export const SETP_VAL = (name: string) => (value: any) =>
  eff(new PEEK()).bind((target) =>
    eff(new UPDATE(target, [name], value)).bind(() =>
      target instanceof HTMLElement
        ? eff(new UPDATE(target, ["style", name], value))
        : noop
    )
  );

export const SETP_VAR = (name: string) => (path: string[]) =>
  eff(new PEEK()).bind((target) =>
    eff(new SAFE_LOOKUP(path)).bind((value) =>
      eff(new UPDATE(target, [name], value)).bind(() =>
        target instanceof HTMLElement
          ? eff(new UPDATE(target, ["style", name], value))
          : noop
      )
    )
  );

export const SET_CURSOR = eff(new PEEK()).bind((value) =>
  eff(new UPDATE_ROOT(["__cursor__"], value))
);
