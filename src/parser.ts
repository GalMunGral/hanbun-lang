import { Ok, Err, Parser, fail, pure } from "./fp-helpers/Parser.js";
import {
  APPLY_FUNC,
  APPLY_OP,
  COND,
  EVAL,
  HANDLE,
  LOAD_CONST,
  LOAD_VAR,
  NODE,
  RST_VAR,
  SEND_MSG,
  SETP_VAL,
  SETP_VAR,
  SET_CURSOR,
  STORE_VAR,
} from "./Runtime.js";
import { NOOP, VM } from "./VM.js";

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
const quoted = r(/(「|『).+?(」|』)/).map((r) => r.slice(1, -1));
const self = r(/吾/).map(() => "__self__");
const attrPath = r(/之/).apr(quoted).sep(ws);
const variablePath = fail.or(() =>
  pure((root: any) => (path: string[]) => [root, ...path])
    .ap(quoted.or(() => self))
    .ap(attrPath)
);

function sequence(actions: VM<any>[]): VM<any> {
  return actions.reduce((prev, cur) => prev.bind(() => cur));
}

const block: Parser<VM<void>, any> = fail.or(() =>
  pure(sequence)
    .apl(r(/曰(「|『)/))
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(r(/(」|』)/))
);

const conditional: Parser<VM<void>, any> = fail
  .or(() =>
    pure(COND)
      .apl(r(/然。/))
      .apl(ws)
      .ap(block)
      .apl(ws)
      .apl(r(/不然。/))
      .apl(ws)
      .ap(block)
  )
  .or(() =>
    pure((alt: VM<void>) => COND(NOOP)(alt))
      .apl(r(/不然。?/))
      .apl(ws)
      .ap(block)
  )
  .or(() =>
    pure((cons: VM<void>) => COND(cons)(NOOP))
      .apl(r(/然。?/))
      .apl(ws)
      .ap(block)
  );

const setCursor: Parser<VM<void>, any> = pure(SET_CURSOR).apl(r(/内/));

const loadVar: Parser<VM<void>, any> = fail.or(() =>
  pure(LOAD_VAR)
    .apl(r(/吾?有彼?/))
    .ap(variablePath)
    .apl(period)
);

const resetAndloadVar: Parser<VM<void>, any> = fail.or(() =>
  pure(RST_VAR).apl(r(/夫/)).ap(variablePath).apl(period)
);

const loadConst: Parser<VM<void>, any> = fail
  .or(() =>
    pure(LOAD_CONST)
      .apl(r(/有數曰/))
      .ap(quoted.map(Number))
      .apl(period)
  )
  .or(() =>
    pure(LOAD_CONST)
      .apl(r(/有言曰/))
      .ap(quoted)
      .apl(period)
  );

const evalExpression = fail.or(() =>
  pure(EVAL)
    .apl(r(/誦/))
    .ap(quoted)
    .apl(r(/而生一物/))
    .apl(period)
);

const storeVar: Parser<VM<void>, any> = fail
  .or(() =>
    pure(STORE_VAR)
      .apl(r(/彼?/))
      .ap(variablePath)
      .apl(r(/當如是/))
      .apl(period)
  )
  .or(() =>
    pure(STORE_VAR)
      .apl(r(/是為|或曰/))
      .ap(variablePath)
      .apl(period)
  );

const domNode: Parser<VM<void>, any> = fail.or(() =>
  pure(NODE).apl(r(/有/)).ap(quoted).apl(period)
);

const setProperty: Parser<VM<void>, any> = fail
  .or(() =>
    pure(SETP_VAR)
      .apl(r(/其/))
      .ap(quoted)
      .apl(r(/者/))
      .apl(period)
      .apl(ws)
      .apl(r(/彼/))
      .ap(variablePath)
      .apl(r(/也/))
      .apl(period)
  )
  .or(() =>
    pure(SETP_VAL)
      .apl(r(/其/))
      .ap(quoted)
      .apl(r(/者/))
      .apl(period)
      .apl(ws)
      .ap(quoted)
      .apl(r(/也/))
      .apl(period)
  )
  .or(() => pure(SETP_VAL).apl(r(/其?/)).ap(quoted).ap(quoted).apl(period));

const defineMethod: Parser<VM<void>, any> = fail.or(() =>
  pure(HANDLE).apl(r(/聞/)).ap(quoted).apl(r(/而/)).ap(block)
);

const applyMethod: Parser<VM<void>, any> = fail
  .or(() =>
    pure(SEND_MSG)
      .apl(r(/望/))
      .ap(variablePath)
      .ap(quoted)
      .apl(r(/之?/))
      .apl(period)
  )
  .or(() =>
    pure(SEND_MSG(["__self__"]))
      .apl(r(/吾欲/))
      .ap(quoted)
      .apl(r(/之?/))
      .apl(period)
  );

const applyFunction: Parser<VM<void>, any> = fail.or(() =>
  pure(APPLY_FUNC).apl(r(/請君/)).apl(ws).ap(quoted).apl(r(/之?/)).apl(period)
);

const applyOperator: Parser<VM<void>, any> = fail.or(() =>
  pure(APPLY_OP)
    .apl(r(/請/))
    .apl(ws)
    .ap(quoted)
    .apl(ws)
    .apl(r(/之?/))
    .apl(period)
);

const instruction: Parser<any, string> = fail
  .or(() => domNode)
  .or(() => evalExpression)
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

export const program: Parser<VM<void>, any> = pure(sequence)
  .apl(ws)
  .ap(instruction.sep(ws))
  .apl(ws);
