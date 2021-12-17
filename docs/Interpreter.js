import { Pure, eff, isEff, noop } from "./fp-helpers/Freer.js";
import { run, ERROR, RESET, PEEK, POP, PUSH, GET_ENV, PUT_ENV, LOOKUP, SAFE_LOOKUP, UPDATE, UPDATE_ROOT, } from "./VM.js";
export const COND = (cons) => (alt) => eff(new POP()).bind((v) => (Boolean(v) ? cons : alt));
export const HANDLE = (name) => (body) => eff(new PEEK()).bind((target) => new Pure(eff(new GET_ENV()).bind((oldEnv) => eff(new PUT_ENV({
    __proto__: oldEnv,
    __self__: target,
    document: window.document,
    window: window,
}))
    .bind(() => body)
    .bind(() => eff(new PUT_ENV(oldEnv))))).bind((FUNC) => eff(new UPDATE(target, [name], FUNC)).bind(() => target instanceof EventTarget
    ? eff(new UPDATE(target, ["on" + name], (e) => {
        e?.stopPropagation();
        run(eff(new PUSH(e)).bind(() => FUNC));
    }))
    : noop)));
export const SEND_MSG = (path) => (method) => eff(new SAFE_LOOKUP(path))
    .bind((target) => typeof target[method] == "function"
    ? // built-in
        eff(new POP()).bind((arg) => eff(new PUSH(target[method](isEff(arg) ? () => run(arg) : arg))))
    : // user-defined
        target[method])
    .bind(() => eff(new PEEK()));
export const LOAD_VAR = (path) => eff(new SAFE_LOOKUP(path)).bind((v) => eff(new PUSH(v)));
export const RST_VAR = (path) => eff(new RESET()).bind(() => LOAD_VAR(path));
export const LOAD_CONST = (literal) => eff(new PUSH(literal));
export const EVAL = (expr) => eff(new PUSH(eval(expr)));
export const NODE = (type) => eff(new LOOKUP(["__cursor__"])).bind((cursor) => {
    let node;
    switch (type) {
        case "svg":
            node = document.createElementNS("http://www.w3.org/2000/svg", type);
            node.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            break;
        case "path":
            node = document.createElementNS("http://www.w3.org/2000/svg", type);
            break;
        default:
            node = document.createElement(type);
    }
    return eff(new PUSH(node));
});
export const APPLY_OP = (op) => eff(new POP()).bind((right) => eff(new POP()).bind((left) => {
    try {
        return eff(new PUSH(eval(`(${JSON.stringify(left)}) ${op} (${JSON.stringify(right)})`)));
    }
    catch (e) {
        return eff(new ERROR(e.message));
    }
}));
export const APPLY_FUNC = (fn) => SEND_MSG(["window"])(fn);
export const STORE_VAR = (path) => eff(new POP()).bind((value) => eff(new UPDATE_ROOT(path, value)));
export const SETP_VAL = (name) => (value) => eff(new PEEK()).bind((target) => eff(new UPDATE(target, [name], value)).bind(() => target instanceof Element
    ? (target.setAttribute(name, value), // TODO
        eff(new UPDATE(target, ["style", name], value)))
    : noop));
export const SETP_VAR = (name) => (path) => eff(new PEEK()).bind((target) => eff(new SAFE_LOOKUP(path)).bind((value) => eff(new UPDATE(target, [name], value)).bind(() => target instanceof Element
    ? (target.setAttribute(name, value), // TODO
        eff(new UPDATE(target, ["style", name], value)))
    : noop)));
export const SET_CURSOR = eff(new PEEK()).bind((value) => eff(new UPDATE_ROOT(["__cursor__"], value)));
