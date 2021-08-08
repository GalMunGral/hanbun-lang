import { Ok, Err, Parser, fail, pure } from "../lib.js";
import { AST } from "./types.js";

const r = (r: RegExp) =>
  new Parser<string, string>((s) => {
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
const period = r(/[，。？]?/);

const variablePath = fail.or(() =>
  pure((root: any) => (path: string[]) => [root, ...path])
    .ap(identifier.or(() => r(/吾/).map(() => "this")))
    .apl(ws)
    .ap(r(/之/).apr(ws).apr(identifier).sep(ws))
);

const setCursor = pure<AST>({
  type: "SET_CURSOR",
})
  .tap(console.log)
  .apl(r(/内/))
  .apl(period);

const loadVar = fail.or(() =>
  pure(
    (path: string[]): AST => ({
      type: "LOAD_VAR",
      path,
    })
  )
    .apl(r(/有/))
    .apl(ws)
    .ap(variablePath)
    .apl(ws)
    .apl(r(/也?/))
    .apl(period)
);

const resetAndloadVar = fail.or(() =>
  pure(
    (path: string[]): AST => ({
      type: "RST_LOAD_VAR",
      path,
    })
  )
    .apl(r(/夫/))
    .apl(ws)
    .ap(variablePath)
    .apl(period)
);

const loadConst = fail
  .or(() =>
    pure(
      (value: string): AST => ({
        type: "LOAD_CONST",
        value,
      })
    )
      .apl(r(/有/))
      .apl(ws)
      .ap(number)
      .apl(ws)
      .apl(r(/也?/))
      .apl(period)
  )
  .or(() =>
    pure(
      (value: string): AST => ({
        type: "LOAD_CONST",
        value,
      })
    )
      .apl(r(/有文曰/))
      .apl(ws)
      .ap(r(/[^云]+/))
      .apl(ws)
      .apl(r(/云云/))
      .apl(period)
  );

const storeVar = fail
  .or(() =>
    pure(
      (path: string[]): AST => ({
        type: "STORE_VAR",
        path,
      })
    )
      .ap(variablePath)
      .apl(ws)
      .apl(r(/(当|应)如是/))
      .apl(period)
  )
  .or(() =>
    pure(
      (path: string[]): AST => ({
        type: "STORE_VAR",
        path,
      })
    )
      .apl(r(/或曰/))
      .apl(ws)
      .ap(variablePath)
      .apl(period)
  );

const evalExpression = fail.or(() =>
  pure(
    (value: string): AST => ({
      type: "EVAL_EXPR",
      value,
    })
  )
    .apl(r(/有咒曰/))
    .apl(ws)
    .ap(r(/[^云]+/))
    .apl(ws)
    .apl(r(/云云/))
    .apl(period)
);

const domNode = fail
  .or(() =>
    pure(
      (tag: string) =>
        (name: string): AST => ({
          type: "DOM_NODE",
          tag,
          name,
        })
    )
      .apl(r(/有/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/曰/))
      .apl(ws)
      .ap(identifier)
      .apl(period)
  )
  .or(() =>
    pure(
      (tag: string): AST => ({
        type: "DOM_NODE",
        tag,
      })
    )
      .apl(r(/有无名/))
      .apl(ws)
      .ap(identifier)
      .apl(period)
  );

const setProperty = fail

  .or(() =>
    pure(
      (name: string) =>
        (path: string[]): AST => ({
          type: "SET_PROP",
          name,
          path,
        })
    )
      .apl(r(/其/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/也?/))
      .apl(ws)
      .ap(variablePath)
      .apl(period)
  )
  .or(() =>
    pure(
      (name: string) =>
        (literal: string): AST => ({
          type: "SET_PROP",
          name,
          literal,
        })
    )
      .apl(r(/其?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/曰/))
      .apl(ws)
      .ap(r(/[^云]+/))
      .apl(r(/云云/))
  )
  .or(() =>
    pure(
      (name: string) =>
        (path: string[]): AST => ({
          type: "SET_PROP",
          name,
          path,
        })
    )
      .apl(r(/其/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/者?/))
      .apl(period)
      .apl(ws)
      .ap(variablePath)
      .apl(ws)
      .apl(r(/也?/))
      .apl(period)
  );

const defineMethod = fail.or(() =>
  pure(
    (name: string) =>
      (body: any[]): AST => ({
        type: "DEF_METHOD",
        name,
        body,
      })
  )
    .apl(r(/闻/))
    .apl(ws)
    .ap(identifier)
    .apl(ws)
    .apl(r(/对曰/))
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(r(/云云/))
    .apl(period)
);

const applyMethod = fail
  .or(() =>
    pure(
      (receiver: string[]) =>
        (method: string): AST => ({
          type: "APPLY_METHOD",
          receiver,
          method,
        })
    )
      .apl(r(/请/))
      .apl(ws)
      .ap(variablePath)
      .apl(ws)
      .apl(r(/君?(一并)?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之?/))
      .apl(period)
  )
  .or(() =>
    pure(
      (receiver: any) =>
        (method: string): AST => ({
          type: "APPLY_METHOD",
          receiver,
          method,
        })
    )
      .ap(variablePath)
      .apl(ws)
      .apl(r(/君?当(一并)?/))
      .apl(ws)
      .ap(identifier)
      .apl(ws)
      .apl(r(/之?/))
      .apl(period)
  );

const applyFunction = fail.or(() =>
  pure(
    (func: string): AST => ({
      type: "APPLY_FUNC",
      func,
    })
  )
    .apl(r(/请(一并)?/))
    .apl(ws)
    // .ap(variablePath)
    .ap(identifier)
    .apl(r(/之/))
    .apl(period)
);

const applyOperator = fail.or(() =>
  pure(
    (op: string): AST => ({
      type: "APPLY_OP",
      op,
    })
  )
    .apl(r(/请(一并)?/))
    .apl(ws)
    .ap(r(/[+\-*/]/))
    .apl(ws)
    .apl(r(/之/))
    .apl(period)
);

const block = fail.or(() =>
  pure(
    (body: any[]): AST => ({
      type: "BLOCK",
      body,
    })
  )
    .apl(r(/曰/))
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(r(/云云/))
    .apl(period)
);

const conditional = fail
  .or(() =>
    pure(
      (body: AST): AST => ({
        type: "IF_TRUE",
        body,
      })
    )
      .apl(r(/然后/))
      .ap(instruction)
      .apl(period)
  )
  .or(() =>
    pure(
      (body: AST): AST => ({
        type: "IF_FALSE",
        body,
      })
    )
      .apl(r(/不然/))
      .apl(r(/则/).or(() => period))
      .ap(instruction)
      .apl(period)
  );

const instruction: Parser<any, string> = fail
  .or(() => evalExpression)
  .or(() => domNode)
  .or(() => setProperty)
  .or(() => defineMethod)
  .or(() => applyMethod)
  .or(() => applyFunction)
  .or(() => applyOperator)
  .or(() => conditional)
  .or(() => block)
  .or(() => storeVar)
  .or(() => loadConst)
  .or(() => loadVar)
  .or(() => resetAndloadVar)
  .or(() => setCursor);

export const program = ws.apr(instruction.sep(ws)).apl(ws);
