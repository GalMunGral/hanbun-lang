import {
  VM,
  Env,
  Stack,
  ErrorM,
  EnvErrorM,
  StackEnvErrorM,
  liftEnvErrorM,
  liftErrorM,
  __LOG__,
  NOOP,
  SAFE_LOOKUP,
  PEEK,
  POP,
  PUSH,
  RESET,
  SET_FROM_ROOT,
  SET_IN_PLACE,
  LOOKUP,
} from "./VM.js";

export const LOAD_VAR = (path: string[]) =>
  __LOG__("LOAD_VAR")(path).bind(() => SAFE_LOOKUP(path).bind((v) => PUSH(v)));

export const RST_VAR = (path: string[]) =>
  __LOG__("RST_VAR")(path).bind(() => RESET().bind(() => LOAD_VAR(path)));

export const LOAD_CONST = (literal: any) =>
  __LOG__("LOAD_CONST")(literal).bind(() => PUSH(literal));

export const NODE = (type: string) =>
  __LOG__("NODE")(type)
    .bind(() => LOOKUP(["__cursor__"]))
    .bind((cursor: HTMLElement) => {
      const node = document.createElement(type);
      cursor?.append(node);
      return PUSH(node);
    });

export const EVAL = (expr: string) =>
  __LOG__("EVAL")(expr).bind(() => PUSH(eval(expr)));

export const APPLY_OP = (op: string) =>
  __LOG__("APPLY_OP")(op).bind(() =>
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
    )
  );

export const APPLY_FUNC = (fn: string) =>
  __LOG__("APPLY_FUNC")(fn).bind(() =>
    SAFE_LOOKUP([fn]).bind((f) =>
      POP().bind((x) => {
        try {
          return PUSH(f(x));
        } catch (e: any) {
          return liftErrorM(ErrorM.err(e.message));
        }
      })
    )
  );

export const STORE = (path: string[]) => (value: any) =>
  __LOG__("STORE")({ path, value }).bind(() => SET_FROM_ROOT(path, value));

export const SET_CURSOR = __LOG__("SET_CURSOR")().bind(() =>
  PEEK().bind(STORE(["__cursor__"]))
);

export const STORE_VAR = (path: string[]) =>
  __LOG__("STORE_VAR")(path).bind(() => PEEK().bind((v) => STORE(path)(v)));

export const SETP_VAL = (name: string) => (value: any) =>
  __LOG__("SETP_VAL")({ name, value }).bind(() =>
    PEEK().bind((target) =>
      SET_IN_PLACE(target, [name], value).bind(() =>
        target instanceof HTMLElement
          ? SET_IN_PLACE(target, ["style", name], value)
          : NOOP
      )
    )
  );

export const SETP_VAR = (name: string) => (path: string[]) =>
  __LOG__("SETP_VAR")({ name, path }).bind(() =>
    PEEK().bind((target) =>
      SAFE_LOOKUP(path).bind((value) =>
        SET_IN_PLACE(target, [name], value).bind(() =>
          target instanceof HTMLElement
            ? SET_IN_PLACE(target, ["style", name], value)
            : NOOP
        )
      )
    )
  );

export const COND = (cons: VM<void>) => (alt: VM<void>) =>
  __LOG__("COND")({ cons, alt }).bind(() =>
    POP().bind((v) => (Boolean(v) ? cons : alt))
  );

export const SEND_MSG = (path: string[]) => (method: string) =>
  __LOG__("SEND_MSG")({ path, method }).bind(() =>
    SAFE_LOOKUP(path)
      .bind(
        (target) =>
          typeof target[method] == "function"
            ? PEEK().bind((arg) => PUSH(target[method](arg))) // built-in
            : target[method] // user-defined
      )
      .bind(() => PEEK())
  );

export const HANDLE = (name: string) => (body: VM<void>) =>
  __LOG__("HANDLE")({ name, body }).bind(() =>
    PEEK().bind((target) =>
      StackEnvErrorM.unit(
        liftEnvErrorM(EnvErrorM.getState()).bind((oldEnv) =>
          liftEnvErrorM(
            EnvErrorM.putState({
              __proto__: oldEnv,
              __self__: target,
              document: window.document,
              window: window,
            })
          )
            .bind(() => body)
            .bind(() => liftEnvErrorM(EnvErrorM.putState(oldEnv)))
        )
      ).bind((FUNC) =>
        SET_IN_PLACE(target, [name], FUNC).bind(() =>
          target instanceof EventTarget
            ? SET_IN_PLACE(target, ["on" + name], (e: Event) => {
                e?.stopPropagation();
                RUN(window["stack"], window)(FUNC);
              })
            : NOOP
        )
      )
    )
  );

export const RUN = (stack: Stack, env: Env) => (task: VM<any>) => {
  console.log("run");
  console.log(
    "FINISHED",
    task
      .bind(() =>
        StackEnvErrorM.getState()
          .bind((stack) => {
            console.log([...stack]);
            return NOOP;
          })
          .bind(() => liftEnvErrorM(EnvErrorM.getState()))
          .bind((env) => {
            console.log(env);
            return NOOP;
          })
      )
      .data.run(stack)
      .data.run(env).data.run.data
  );
};
