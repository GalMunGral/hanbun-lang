import { ErrorM, EnvErrorM, StackEnvErrorM, liftErrorM, liftEnvErrorM, } from "./VM.js";
export function RESET() {
    return StackEnvErrorM.putState([]);
}
export function PUSH(v) {
    return StackEnvErrorM.getState()
        .bind((stack) => StackEnvErrorM.putState([...stack, v]))
        .bind(() => StackEnvErrorM.getState())
        .bind(() => StackEnvErrorM.unit(undefined));
}
export function PEEK() {
    return StackEnvErrorM.getState().bind((stack) => stack.length
        ? liftErrorM(ErrorM.unit(stack[stack.length - 1]))
        : liftErrorM(ErrorM.err("out of bounds")));
}
export function POP() {
    return StackEnvErrorM.getState().bind((stack) => stack.length
        ? StackEnvErrorM.putState(stack.slice(0, -1)).bind(() => StackEnvErrorM.unit(stack[stack.length - 1]))
        : liftErrorM(ErrorM.err("out of bounds")));
}
export function LOOKUP(path) {
    return liftEnvErrorM(EnvErrorM.getState()).bind((env) => {
        const res = path.reduce((cur, p) => cur?.[p], env);
        return liftErrorM(res ? ErrorM.unit(res) : ErrorM.err(`${path} not found`));
    });
}
export function SET_IN_PLACE(root, path, value) {
    return path.length == 0
        ? liftErrorM(ErrorM.err("end reached?"))
        : path.length == 1
            ? StackEnvErrorM.unit(((root[path[0]] = value), root))
            : SET_IN_PLACE(typeof root[path[0]] != "object" || root[path[0]] == null
                ? {}
                : root[path[0]], path.slice(1), value).bind((updated) => StackEnvErrorM.unit(((root[path[0]] = updated), root)));
}
