import { Ok, Err, Parser, fail, pure } from "./lib.js";
const r = (r) =>
  new Parser((s) => {
    const match = s.match(r);
    if (match == null || (match.index && match.index > 0)) {
      return new Err(`Expected ${r} at "${s}"`, s);
    }
    const token = match[0];
    return new Ok(token, s.slice(token.length));
  });
const ws = r(/\s*/);
const number = r(/\d+(\.\d+)?/).map(Number);
const identifier = r(/[\w-]+/);
const open = r(/「/);
const close = r(/」/);
const period = r(/。/);
const stringLiteral = fail.or(() =>
  pure((literal) => ({
    type: "LOAD_STR",
    literal,
  }))
    .apl(r(/有文曰/))
    .apl(ws)
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(period)
);
const evalExpression = fail.or(() =>
  pure((expression) => ({
    type: "EVAL_EXPR",
    expression,
  }))
    .apl(r(/有咒曰/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(r(/[^」]+/))
    .apl(ws)
    .apl(close)
    .apl(period)
);
const variablePath = fail.or(() =>
  pure((root) => (path) => [root, ...path])
    .ap(identifier.or(() => r(/吾/).map(() => "this")))
    .apl(ws)
    .ap(r(/之/).apr(ws).apr(identifier).sep(ws))
);
const domNode = fail.or(() =>
  pure((tag) => (name) => ({
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
    .apl(period)
);
const setProperty = fail
  .or(() =>
    pure((name) => (path) => ({
      type: "SET_PROP",
      name,
      path,
    }))
      .apl(r(/其/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/者?/))
      .apl(ws)
      .ap(variablePath)
      .apl(ws)
      .apl(r(/也?/))
      .apl(period)
  )
  .or(() =>
    pure((name) => (literal) => ({
      type: "SET_PROP",
      name,
      literal,
    }))
      .apl(r(/其/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/者?/))
      .apl(ws)
      .apl(open)
      .ap(r(/[^」]+/))
      .apl(close)
      .apl(ws)
      .apl(r(/也?/))
      .apl(period)
  );
const setChildren = fail.or(() =>
  pure((children) => ({
    type: "SET_CHILD",
    children,
  }))
    .apl(r(/其中/))
    .ap(domNode.many())
);
const defineMethod = fail.or(() =>
  pure((name) => (body) => ({
    type: "DEF_METHOD",
    name,
    body,
  }))
    .apl(r(/问之/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(close)
    .apl(period)
    .apl(ws)
    .apl(r(/对曰/))
    .apl(ws)
    .apl(open)
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(close)
);
const applyMethod = fail
  .or(() =>
    pure((receiver) => (method) => ({
      type: "APPLY_METHOD",
      receiver,
      method,
    }))
      .apl(r(/請/))
      .apl(ws)
      .ap(variablePath)
      .apl(ws)
      .apl(r(/君?(一併)?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之/))
      .apl(period)
  )
  .or(() =>
    pure((receiver) => (method) => ({
      type: "APPLY_METHOD",
      receiver,
      method,
    }))
      .ap(variablePath)
      .apl(ws)
      .apl(r(/當(一併)?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之/))
      .apl(period)
  )
  .or(() =>
    pure((method) => ({
      type: "APPLY_METHOD",
      receiver: "this",
      method,
    }))
      .apl(r(/吾當(一併)?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之/))
      .apl(period)
  );
const applyFunction = fail.or(() =>
  pure((func) => ({
    type: "APPLY_FUNC",
    func,
  }))
    .apl(r(/(一併)?/))
    .apl(ws)
    .ap(variablePath)
    .apl(r(/之/))
    .apl(period)
);
const applyOperator = fail.or(() =>
  pure((literal) => ({
    type: "APPLY_OP",
    literal,
  }))
    .apl(r(/(一併)?/))
    .apl(ws)
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(ws)
    .apl(r(/之/))
    .apl(period)
);
const loadVar = fail.or(() =>
  pure((path) => ({
    type: "LOAD_VAR",
    path,
  }))
    .apl(r(/有/))
    .apl(ws)
    .ap(variablePath)
    .apl(period)
);
const resetAndloadVar = fail.or(() =>
  pure((path) => ({
    type: "RST_LOAD_VAR",
    path,
  }))
    .apl(r(/夫/))
    .apl(ws)
    .ap(variablePath)
    .apl(period)
);
const loadConst = fail.or(() =>
  pure((literal) => ({
    type: "LOAD_CONST",
    literal,
  }))
    .apl(r(/有/))
    .apl(ws)
    .ap(number)
    .apl(period)
);
const storeVar = fail
  .or(() =>
    pure((path) => ({
      type: "STORE_VAR",
      path,
    }))
      .ap(variablePath)
      .apl(ws)
      .apl(r(/當如是/))
      .apl(period)
  )
  .or(() =>
    pure((path) => ({
      type: "STORE_VAR",
      path,
    }))
      .apl(r(/或曰/))
      .apl(ws)
      .ap(variablePath)
      .apl(period)
  );
const pop = pure({
  type: "POP",
}).apl(r(/另/));
const reset = pure({
  type: "RST",
}).apl(r(/盖|夫/));
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
  .or(() => resetAndloadVar)
  .or(() => reset)
  .or(() => pop);
const program = ws.apr(instruction.sep(ws)).apl(ws);
export { program as parser };
