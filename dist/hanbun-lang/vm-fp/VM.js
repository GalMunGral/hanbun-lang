import { Identity } from "./Identity.js";
import { ErrorT } from "./Error.js";
import { StateT } from "./State.js";
const Id = Identity.instance();
export const ErrorM = ErrorT.trans(Id);
export const EnvErrorM = StateT.trans(ErrorM);
export const StackEnvErrorM = StateT.trans(EnvErrorM);
export function liftErrorM(m) {
    return StateT.lift(StateT.lift(m));
}
export function liftEnvErrorM(m) {
    return StateT.lift(m);
}
