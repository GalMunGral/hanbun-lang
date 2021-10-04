import { LOOKUP, PEEK, POP, PUSH, RESET, SET_IN_PLACE } from "./Operations.js";
import { ErrorM, EnvErrorM, StackEnvErrorM, liftEnvErrorM, liftErrorM, } from "./VM.js";
export function LOAD_VAR(path) {
    return LOOKUP(path).bind((v) => PUSH(v));
}
export function RST_VAR(path) {
    return RESET().bind(() => LOAD_VAR(path));
}
export function LOAD_CONST(literal) {
    return PUSH(literal);
}
export function NODE(type) {
    return PUSH(document.createElement(type));
}
export function APPLY_OP(op) {
    return POP().bind((right) => POP().bind((left) => {
        try {
            return PUSH(eval(`${left} ${op} ${right}`));
        }
        catch (e) {
            return liftErrorM(ErrorM.err(e.message));
        }
    }));
}
export function APPLY_FUNC(fn) {
    return LOOKUP([fn]).bind((f) => POP().bind((x) => {
        try {
            return PUSH(f(x));
        }
        catch (e) {
            return liftErrorM(ErrorM.err(e.message));
        }
    }));
}
export function STORE(path, value) {
    return liftEnvErrorM(EnvErrorM.getState()).bind((env) => SET_IN_PLACE(env, path, value));
}
export function SET_CURSOR(node) {
    return STORE(["__cursor__"], node);
}
export function STORE_VAR(path) {
    return PEEK().bind((v) => STORE(path, v));
}
export function SET_VAL(name, value) {
    return PEEK().bind((target) => SET_IN_PLACE(target, [name], value));
}
export function SET_VAR(name, path) {
    return PEEK().bind((target) => LOOKUP(path).bind((value) => SET_IN_PLACE(target, [name], value)));
}
export function COND(cons, alt) {
    return POP().bind((v) => (Boolean(v) ? cons : alt));
}
export function SEND_MSG(path, method) {
    return LOOKUP(path)
        .bind((target) => target[method])
        .bind(() => PEEK());
}
export function HANDLE(name, body) {
    return PEEK().bind((target) => SET_IN_PLACE(target, [name], body));
}
export function DEBUG(...tag) {
    return function (value) {
        console.log(tag, value);
        return StackEnvErrorM.unit(value);
    };
}
export function RUN(task, stack, env) {
    return task.data.run(stack).data.run(env).data.run.data;
}
