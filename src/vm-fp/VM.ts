import { Monad } from "./types.js";
import { Identity } from "./Identity.js";
import { ErrorT } from "./Error.js";
import { StateT } from "./State.js";

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
