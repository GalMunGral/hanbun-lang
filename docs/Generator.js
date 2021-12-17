import { Pure, eff, isEff } from "./fp-helpers/Freer.js";
import { RUN, PEEK, POP, PUSH, BINOP, GET_ENV, PUT_ENV, SAFE_LOOKUP, UPDATE, UPDATE_ROOT, NOOP, } from "./Interpreter.js";
export const COND = (cons) => (alt) => eff(new POP()).bind((v) => (Boolean(v) ? cons : alt));
export const HANDLE = (name) => (body) => eff(new PEEK()).bind((target) => new Pure(eff(new GET_ENV()).bind((oldEnv) => eff(new PUT_ENV({
    __proto__: oldEnv,
    __self__: target,
    document: window.document,
    window: window,
}))
    .bind(() => body)
    .bind(() => eff(new PUT_ENV(oldEnv))))).bind((FUNC) => 
// sync methods and async event handlers are treated equally
eff(new UPDATE(target, [name], FUNC)).bind(() => target instanceof EventTarget
    ? eff(new UPDATE(target, ["on" + name], (e) => {
        e?.stopPropagation();
        RUN(eff(new PUSH(e)).bind(() => FUNC));
    }))
    : eff(NOOP))));
export const SEND_MSG = (path) => (method) => eff(new SAFE_LOOKUP(path))
    .bind((target) => typeof target[method] == "function"
    ? // built-in
        eff(new POP()).bind((arg) => {
            const res = target[method](isEff(arg) ? () => RUN(arg) : arg);
            return eff(new PUSH(res));
        })
    : // user-defined
        target[method])
    .bind(() => eff(new PEEK()));
export const LOAD_VAR = (path) => eff(new SAFE_LOOKUP(path)).bind((v) => eff(new PUSH(v)));
export const LOAD_CONST = (literal) => eff(new PUSH(literal));
export const NODE = (type) => eff(NOOP).bind(() => {
    let node;
    switch (type) {
        case "svg":
            node = document.createElementNS("http://www.w3.org/2000/svg", type);
            node.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            break;
        default:
            node = document.createElement(type);
    }
    return eff(new PUSH(node));
});
export const OPERATE = (op) => eff(new POP()).bind((right) => eff(new POP())
    .bind((left) => eff(new BINOP(op, left, right)))
    .bind((res) => eff(new PUSH(res))));
export const STORE_VAR = (path) => eff(new POP()).bind((value) => eff(new UPDATE_ROOT(path, value)));
export const SETP_VAL = (name) => (value) => eff(new PEEK()).bind((target) => eff(new UPDATE(target, [name], value)));
export const SETP_VAR = (name) => (path) => eff(new PEEK()).bind((target) => eff(new SAFE_LOOKUP(path)).bind((value) => eff(new UPDATE(target, [name], value))));
