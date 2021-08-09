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
const period = r(/。/);
const quoted = r(/「.+?」/).map((r) => r.slice(1, -1));
const self = r(/吾/).map(() => "this");
const attrPath = r(/之/).apr(quoted).sep(ws);
const variablePath = fail.or(() =>
  pure((root: any) => (path: string[]) => [root, ...path])
    .ap(quoted.or(() => self))
    .ap(attrPath)
);

const block = fail.or(() =>
  pure(
    (body: any[]): AST => ({
      type: "BLOCK",
      body,
    })
  )
    .apl(r(/曰「/))
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(r(/」/))
);

const conditional = fail
  .or(() =>
    pure(
      (consequent: AST[]) =>
        (alternate: AST[]): AST => ({
          type: "BRANCH",
          consequent,
          alternate,
        })
    )
      .apl(r(/然。/))
      .apl(ws)
      .ap(block.map((b) => b.body))
      .apl(ws)
      .apl(r(/不然。/))
      .apl(ws)
      .ap(block.map((b) => b.body))
  )
  .or(() =>
    pure(
      (alternate: AST[]): AST => ({
        type: "BRANCH",
        consequent: [],
        alternate,
      })
    )
      .apl(r(/不然。/))
      .apl(ws)
      .ap(block.map((b) => b.body))
  )
  .or(() =>
    pure(
      (consequent: AST[]): AST => ({
        type: "BRANCH",
        consequent,
        alternate: [],
      })
    )
      .apl(r(/然。/))
      .apl(ws)
      .ap(block.map((b) => b.body))
  );

const setCursor = pure<AST>({
  type: "SET_CURSOR",
}).apl(r(/内/));

const loadVar = fail.or(() =>
  pure(
    (path: string[]): AST => ({
      type: "LOAD_VAR",
      path,
    })
  )
    .apl(r(/吾?有彼?/))
    .ap(variablePath)
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
      .apl(r(/有數曰/))
      .ap(quoted.map(Number))
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
      .ap(quoted)
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
      .apl(r(/彼?/))
      .ap(variablePath)
      .apl(r(/當如是/))
      .apl(period)
  )
  .or(() =>
    pure(
      (path: string[]): AST => ({
        type: "STORE_VAR",
        path,
      })
    )
      .apl(r(/是為|或曰/))
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
    .apl(r(/唸/))
    .ap(quoted)
    .apl(r(/而得一物/))
    .apl(period)
);

const domNode = fail.or(() =>
  pure(
    (tag: string): AST => ({
      type: "DOM_NODE",
      tag,
    })
  )
    .apl(r(/有/))
    .ap(quoted)
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
      .ap(quoted)
      .apl(r(/者/))
      .apl(period)
      .apl(ws)
      .apl(r(/彼?/))
      .ap(variablePath)
      .apl(r(/也/))
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
      .apl(r(/其/))
      .ap(quoted)
      .apl(r(/者/))
      .apl(period)
      .apl(ws)
      .apl(r(/曰/))
      .ap(quoted)
      .apl(r(/也/))
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
      .ap(quoted)
      .ap(quoted)
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
    .apl(r(/聞/))
    .ap(quoted)
    .apl(r(/而答/))
    .ap(block.map((b) => b.body))
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
      .apl(r(/願/))
      .ap(variablePath)
      .ap(quoted)
      .apl(r(/之/))
      .apl(period)
  )
  .or(() =>
    pure(
      (method: string): AST => ({
        type: "APPLY_METHOD",
        receiver: ["this"],
        method,
      })
    )
      .apl(r(/吾欲/))
      .ap(quoted)
      .apl(r(/之/))
      .apl(period)
  );

const applyFunction = fail.or(() =>
  pure(
    (func: string): AST => ({
      type: "APPLY_FUNC",
      func,
    })
  )
    .apl(r(/請君/))
    .apl(ws)
    .ap(quoted)
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
    .apl(r(/請/))
    .apl(ws)
    .ap(quoted)
    .apl(ws)
    .apl(r(/之/))
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
