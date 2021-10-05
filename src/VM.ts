import { Monad } from "./fp-helpers/types.js";
import { Identity } from "./fp-helpers/Identity.js";
import { ErrorT } from "./fp-helpers/ErrorT.js";
import { StateT } from "./fp-helpers/StateT.js";

export type Env = any;
export type Stack = any[];
export type VM<V> = Monad<
  StateT<Stack, StateT<Env, ErrorT<string, Identity>>>,
  V
>;

const Id = Identity.instance();
export const ErrorM = ErrorT.trans<string, Identity, any>(Id);
export const EnvErrorM = StateT.trans<Env, ErrorT<string, Identity>, any>(
  ErrorM
);
export const StackEnvErrorM = StateT.trans<
  Stack,
  StateT<Env, ErrorT<string, Identity>>,
  any
>(EnvErrorM);

export function liftErrorM<V>(m: Monad<ErrorT<string, Identity>, V>): VM<V> {
  return StateT.lift<Stack, StateT<Env, ErrorT<string, Identity>>, V>(
    StateT.lift<Env, ErrorT<string, Identity>, V>(m)
  );
}

export function liftEnvErrorM<V>(
  m: Monad<StateT<Env, ErrorT<string, Identity>>, V>
): VM<V> {
  return StateT.lift<Stack, StateT<Env, ErrorT<string, Identity>>, V>(m);
}

export const NOOP = StackEnvErrorM.unit(undefined);

export const RUN = (stack: Stack, env: Env) => (task: VM<any>) => {
  return task.data.run(stack).data.run(env).data.run.data;
};

export function RESET(): VM<void> {
  return StackEnvErrorM.putState([]);
}

export function PUSH(v: any): VM<void> {
  return StackEnvErrorM.getState()
    .bind((stack) => StackEnvErrorM.putState([...stack, v]))
    .bind(() => StackEnvErrorM.getState())
    .bind(() => StackEnvErrorM.unit(undefined));
}

export function PEEK(): VM<any> {
  return StackEnvErrorM.getState().bind((stack) =>
    stack.length
      ? liftErrorM(ErrorM.unit(stack[stack.length - 1]))
      : liftErrorM(ErrorM.err("out of bounds"))
  );
}

export function POP(): VM<any> {
  return StackEnvErrorM.getState().bind((stack) =>
    stack.length
      ? StackEnvErrorM.putState(stack.slice(0, -1)).bind(() =>
          StackEnvErrorM.unit(stack[stack.length - 1])
        )
      : liftErrorM(ErrorM.err("out of bounds"))
  );
}

export function LOOKUP(path: string[]): VM<any> {
  return liftEnvErrorM(EnvErrorM.getState()).bind((env) =>
    StackEnvErrorM.unit(path.reduce((cur, p) => cur?.[p], env))
  );
}

export function SAFE_LOOKUP(path: string[]): VM<any> {
  return liftEnvErrorM(EnvErrorM.getState()).bind((env) => {
    const res = path.reduce((cur, p) => cur?.[p], env);
    return liftErrorM(
      res !== undefined ? ErrorM.unit(res) : ErrorM.err(`${path} not found`)
    );
  });
}

export function UPDATE(root: any, path: string[], value: any): VM<any> {
  return path.length === 0
    ? liftErrorM(ErrorM.err("end reached?"))
    : path.length === 1
    ? StackEnvErrorM.unit(((root[path[0]] = value), root))
    : UPDATE(
        typeof root[path[0]] != "object" || root[path[0]] == null
          ? (root[path[0]] = {})
          : root[path[0]],
        path.slice(1),
        value
      ).bind(() => StackEnvErrorM.unit(root));
}

export function UPDATE_ROOT(path: string[], value: any): VM<any> {
  return liftEnvErrorM(EnvErrorM.getState()).bind((env) =>
    UPDATE(env, path, value)
  );
}
