import { Ok, Err, Parser, fail, pure } from "./lib.js";

const r = (r: RegExp) =>
  new Parser<string, string>((s) => {
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

const stringLiteral: Parser<any, string> = fail.or(() =>
  pure((literal: string) => ({
    type: "STRING",
    literal,
  }))
    .apl(r(/有文曰/))
    .apl(ws)
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(pediod)
);

const evalExpression: Parser<any, string> = fail.or(() =>
  pure((expression: string) => ({
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
    .apl(pediod)
);

const variablePath: Parser<any, string> = fail.or(() =>
  pure((root: any) => (path: string[]) => [root, ...path])
    .ap(identifier.or(() => r(/吾/).map(() => "this")))
    .apl(ws)
    .ap(r(/之/).apr(ws).apr(identifier).sep(ws))
);

const domNode: Parser<any, string> = fail.or(() =>
  pure((tag: string) => (name: string) => ({
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
    .apl(pediod)
);

const setProperty: Parser<any, string> = fail
  .or(() =>
    pure((name: string) => (path: string) => ({
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
      .apl(pediod)
  )
  .or(() =>
    pure((name: string) => (literal: string) => ({
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
      .apl(pediod)
  );

const setChildren: Parser<any, string> = fail.or(() =>
  pure((children: any[]) => ({
    type: "SET_CHILD",
    children,
  }))
    .apl(r(/其中/))
    .apl(pediod)
    .ap(domNode.many())
);

const defineMethod: Parser<any, string> = fail.or(() =>
  pure((name: string) => (body: any[]) => ({
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
    .apl(close)
);

const applyMethod: Parser<any, string> = fail
  .or(() =>
    pure((receiver: any) => (method: string) => ({
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
      .apl(pediod)
  )
  .or(() =>
    pure((method: string) => ({
      type: "APPLY_METHOD",
      receiver: "this",
      method,
    }))
      .apl(r(/当/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之/))
      .apl(pediod)
  );

const applyFunction: Parser<any, string> = fail.or(() =>
  pure((func: any) => ({
    type: "APPLY_FUNC",
    func,
  }))
    .ap(variablePath)
    .apl(r(/之/))
    .apl(pediod)
);

const applyOperator: Parser<any, string> = fail.or(() =>
  pure((literal: any) => ({
    type: "APPLY_OP",
    literal,
  }))
    .apl(open)
    .ap(r(/[^」]+/))
    .apl(close)
    .apl(ws)
    .apl(r(/之/))
    .apl(pediod)
);

const clearLoadVar: Parser<any, string> = fail.or(() =>
  pure((path: string) => ({
    type: "CLR_LOAD_VAR",
    path,
  }))
    .apl(r(/夫/))
    .apl(ws)
    .ap(variablePath)
    .apl(pediod)
);

const loadVar: Parser<any, string> = fail.or(() =>
  pure((path: any) => ({
    type: "LOAD_VAR",
    path,
  }))
    .apl(r(/有/))
    .apl(ws)
    .ap(variablePath)
    .apl(pediod)
);

const loadConst: Parser<any, string> = fail.or(() =>
  pure((literal: any) => ({
    type: "LOAD_CONST",
    literal,
  }))
    .apl(r(/有/))
    .apl(ws)
    .ap(number)
    .apl(pediod)
);

const storeVar: Parser<any, string> = fail
  .or(() =>
    pure((path: any) => ({
      type: "STORE_VAR",
      path,
    }))
      .ap(variablePath)
      .apl(ws)
      .apl(r(/当如是/))
      .apl(pediod)
  )
  .or(() =>
    pure((path: any) => ({
      type: "STORE_VAR",
      path,
    }))
      .apl(r(/或曰/))
      .apl(ws)
      .ap(variablePath)
      .apl(pediod)
  );

const instruction: Parser<any, string> = fail
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
