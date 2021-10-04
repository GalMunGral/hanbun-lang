import { LOOKUP, PEEK, POP, PUSH, RESET, SET_IN_PLACE } from "./Operations.js";
import {
  VM,
  Env,
  Stack,
  ErrorM,
  EnvErrorM,
  StackEnvErrorM,
  liftEnvErrorM,
  liftErrorM,
} from "./VM.js";

export function LOAD_VAR(path: string[]): VM<void> {
  return LOOKUP(path).bind((v) => PUSH(v));
}

export function RST_VAR(path: string[]): VM<void> {
  return RESET().bind(() => LOAD_VAR(path));
}

export function LOAD_CONST(literal: any): VM<void> {
  return PUSH(literal);
}

export function NODE(type: string): VM<void> {
  return PUSH(document.createElement(type));
}

export function APPLY_OP(op: string): VM<void> {
  return POP().bind((right) =>
    POP().bind((left) => {
      try {
        return PUSH(eval(`${left} ${op} ${right}`));
      } catch (e: any) {
        return liftErrorM(ErrorM.err(e.message));
      }
    })
  );
}

export function APPLY_FUNC(fn: string): VM<void> {
  return LOOKUP([fn]).bind((f) =>
    POP().bind((x) => {
      try {
        return PUSH(f(x));
      } catch (e: any) {
        return liftErrorM(ErrorM.err(e.message));
      }
    })
  );
}

export function STORE(path: string[], value: any) {
  return liftEnvErrorM(EnvErrorM.getState()).bind((env) =>
    SET_IN_PLACE(env, path, value)
  );
}

export function SET_CURSOR(node: any): VM<void> {
  return STORE(["__cursor__"], node);
}

export function STORE_VAR(path: string[]): VM<void> {
  return PEEK().bind((v) => STORE(path, v));
}

export function SET_VAL(name: string, value: any): VM<void> {
  return PEEK().bind((target) => SET_IN_PLACE(target, [name], value));
}

export function SET_VAR(name: string, path: string[]): VM<void> {
  return PEEK().bind((target) =>
    LOOKUP(path).bind((value) => SET_IN_PLACE(target, [name], value))
  );
}

export function COND(cons: VM<void>, alt: VM<void>): VM<void> {
  return POP().bind((v) => (Boolean(v) ? cons : alt));
}

export function SEND_MSG(path: string[], method: string): VM<void> {
  return LOOKUP(path)
    .bind((target) => target[method])
    .bind(() => PEEK());
}

export function HANDLE(name: string, body: VM<void>): VM<void> {
  return PEEK().bind((target) => SET_IN_PLACE(target, [name], body));
}

export function DEBUG<V>(...tag: any) {
  return function (value: V): VM<V> {
    console.log(tag, value);
    return StackEnvErrorM.unit(value);
  };
}

export function RUN(task: VM<any>, stack: Stack, env: Env) {
  return task.data.run(stack).data.run(env).data.run.data;
}
