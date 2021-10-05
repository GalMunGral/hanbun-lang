import {
  VM,
  ErrorM,
  EnvErrorM,
  StackEnvErrorM,
  liftEnvErrorM,
  liftErrorM,
  RUN,
  NOOP,
  RESET,
  PEEK,
  POP,
  PUSH,
  LOOKUP,
  SAFE_LOOKUP,
  UPDATE,
  UPDATE_ROOT,
} from "./VM.js";

export const COND = (cons: VM<void>) => (alt: VM<void>) =>
  POP().bind((v) => (Boolean(v) ? cons : alt));

export const HANDLE = (name: string) => (body: VM<void>) =>
  PEEK().bind((target) =>
    StackEnvErrorM.unit(
      liftEnvErrorM(EnvErrorM.GET()).bind((oldEnv) =>
        liftEnvErrorM(
          EnvErrorM.PUT({
            __proto__: oldEnv,
            __self__: target,
            document: window.document,
            window: window,
          })
        )
          .bind(() => body)
          .bind(() => liftEnvErrorM(EnvErrorM.PUT(oldEnv)))
      )
    ).bind((FUNC) =>
      UPDATE(target, [name], FUNC).bind(() =>
        target instanceof EventTarget
          ? UPDATE(target, ["on" + name], (e: Event) => {
              e?.stopPropagation();
              RUN([], window)(FUNC);
            })
          : NOOP
      )
    )
  );

export const SEND_MSG = (path: string[]) => (method: string) =>
  SAFE_LOOKUP(path)
    .bind(
      (target) =>
        typeof target[method] == "function"
          ? PEEK().bind((arg) => PUSH(target[method](arg))) // built-in
          : target[method] // user-defined
    )
    .bind(() => PEEK());

export const LOAD_VAR = (path: string[]) =>
  SAFE_LOOKUP(path).bind((v) => PUSH(v));

export const RST_VAR = (path: string[]) => RESET().bind(() => LOAD_VAR(path));

export const LOAD_CONST = (literal: any) => PUSH(literal);

export const EVAL = (expr: string) => PUSH(eval(expr));

export const NODE = (type: string) =>
  LOOKUP(["__cursor__"]).bind((cursor: HTMLElement) => {
    const node = document.createElement(type);
    cursor?.append(node);
    return PUSH(node);
  });

export const APPLY_OP = (op: string) =>
  POP().bind((right) =>
    POP().bind((left) => {
      try {
        return PUSH(
          eval(`${JSON.stringify(left)} ${op} ${JSON.stringify(right)}`)
        );
      } catch (e: any) {
        return liftErrorM(ErrorM.err(e.message));
      }
    })
  );

export const APPLY_FUNC = (fn: string) =>
  SAFE_LOOKUP([fn]).bind((f) =>
    POP().bind((x) => {
      try {
        return PUSH(f(x));
      } catch (e: any) {
        return liftErrorM(ErrorM.err(e.message));
      }
    })
  );

export const STORE_VAR = (path: string[]) =>
  PEEK().bind((value) => UPDATE_ROOT(path, value));

export const SETP_VAL = (name: string) => (value: any) =>
  PEEK().bind((target) =>
    UPDATE(target, [name], value).bind(() =>
      target instanceof HTMLElement
        ? UPDATE(target, ["style", name], value)
        : NOOP
    )
  );

export const SETP_VAR = (name: string) => (path: string[]) =>
  PEEK().bind((target) =>
    SAFE_LOOKUP(path).bind((value) =>
      UPDATE(target, [name], value).bind(() =>
        target instanceof HTMLElement
          ? UPDATE(target, ["style", name], value)
          : NOOP
      )
    )
  );

export const SET_CURSOR = PEEK().bind((value) =>
  UPDATE_ROOT(["__cursor__"], value)
);
