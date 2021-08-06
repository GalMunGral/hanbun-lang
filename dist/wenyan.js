import { Ok, Err, Parser, fail, pure } from "./lib.js";
const r = (r) => new Parser((s) => {
    const match = s.match(r);
    if (match == null || (match.index && match.index > 0)) {
        return new Err(`Expected ${r} at "${s}"`);
    }
    const token = match[0];
    return new Ok(token, s.slice(token.length));
});
const ws = r(/\s*/);
const number = r(/\d+(\.\d+)?/).map(Number);
const identifier = r(/[\w-]+/);
const open = r(/「/);
const close = r(/」/);
const pediod = r(/。/);
const stringLiteral = fail.or(() => pure((literal) => ({
    type: "STRING",
    literal,
}))
    .apl(r(/有文曰/))
    .apl(ws)
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(pediod));
const evalExpression = fail.or(() => pure((expr) => ({
    type: "EVAL_EXPR",
    expr,
}))
    .apl(r(/有咒曰/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(r(/[^」]+/))
    .apl(ws)
    .apl(close)
    .apl(pediod));
const variablePath = fail.or(() => pure((root) => (path) => [root, ...path])
    .ap(identifier.or(() => r(/吾/).map(() => "this")))
    .apl(ws)
    .ap(r(/之/).apr(ws).apr(identifier).sep(ws)));
const domNode = fail.or(() => pure((tag) => (name) => ({
    type: "DOM_NODE",
    tag,
    name,
}))
    .apl(r(/有/))
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(r(/曰/))
    .apl(ws)
    .ap(identifier)
    .apl(pediod));
const setProperty = fail
    .or(() => pure((name) => (path) => ({
    type: "SET_PROP",
    name,
    path,
}))
    .apl(r(/其/))
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .ap(variablePath)
    .apl(ws)
    .apl(r(/也/))
    .apl(pediod))
    .or(() => pure((name) => (literal) => ({
    type: "SET_PROP",
    name,
    literal,
}))
    .apl(r(/其/))
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(ws)
    .apl(r(/也/))
    .apl(pediod));
const setChildren = fail.or(() => pure((children) => ({
    type: "SET_CHILD",
    children,
}))
    .apl(r(/其中/))
    .apl(pediod)
    .ap(domNode.many()));
const defineMethod = fail.or(() => pure((name) => (body) => ({
    type: "DEFN_METHOD",
    name,
    body,
}))
    .apl(r(/问/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(close)
    .apl(pediod)
    .apl(ws)
    .apl(r(/对曰/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(close));
const applyMethod = fail
    .or(() => pure((receiver) => (method) => ({
    type: "APPLY_METHOD",
    receiver,
    method,
}))
    .apl(r(/请/))
    .apl(ws)
    .ap(variablePath)
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(r(/之/))
    .apl(pediod))
    .or(() => pure((method) => ({
    type: "APPLY_METHOD",
    receiver: "this",
    method,
}))
    .apl(r(/当/))
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(r(/之/))
    .apl(pediod));
const applyFunction = fail.or(() => pure((func) => ({
    type: "APPLY_FUNC",
    func,
}))
    .ap(variablePath)
    .apl(r(/之/))
    .apl(pediod));
const applyOperator = fail.or(() => pure((literal) => ({
    type: "APPLY_OP",
    literal,
}))
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(ws)
    .apl(r(/之/))
    .apl(pediod));
const clearLoadVar = fail.or(() => pure((path) => ({
    type: "CLR_LOAD_VAR",
    path,
}))
    .apl(r(/夫/))
    .apl(ws)
    .ap(variablePath)
    .apl(pediod));
const loadVar = fail.or(() => pure((accesor) => ({
    type: "LOAD_VAR",
    accesor,
}))
    .apl(r(/有/))
    .apl(ws)
    .ap(variablePath)
    .apl(pediod));
const loadConst = fail.or(() => pure((literal) => ({
    type: "LOAD_CONST",
    literal,
}))
    .apl(r(/有/))
    .apl(ws)
    .ap(number)
    .apl(pediod));
const storeVar = fail
    .or(() => pure((accesor) => ({
    type: "LOAD_VAR",
    accesor,
}))
    .ap(variablePath)
    .apl(ws)
    .apl(r(/当如是/))
    .apl(pediod))
    .or(() => pure((accesor) => ({
    type: "LOAD_VAR",
    accesor,
}))
    .apl(r(/或曰/))
    .apl(ws)
    .ap(variablePath)
    .apl(pediod));
const instruction = fail
    .or(() => stringLiteral)
    .or(() => evalExpression)
    .or(() => domNode)
    .or(() => setProperty)
    .or(() => setChildren)
    .or(() => defineMethod)
    .or(() => applyMethod)
    .or(() => applyFunction)
    .or(() => applyOperator)
    .or(() => storeVar)
    .or(() => loadConst)
    .or(() => loadVar)
    .or(() => clearLoadVar);
const program = ws.apr(instruction.sep(ws)).apl(ws);
export { program as parser };
