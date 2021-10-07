import { Parser } from "./fp-helpers/Parser.js";
import { Eff, noop } from "./fp-helpers/Freer.js";
import {
  COND,
  HANDLE,
  SEND_MSG,
  LOAD_VAR,
  RST_VAR,
  LOAD_CONST,
  EVAL,
  NODE,
  APPLY_OP,
  APPLY_FUNC,
  STORE_VAR,
  SETP_VAL,
  SETP_VAR,
  SET_CURSOR,
} from "./Interpreter.js";

const r = (r: RegExp) =>
  new Parser<string>((s) => {
    const match = s.match(r);
    if (match == null || (match.index && match.index > 0)) {
      return Parser.err(`Expected ${r} at "${s}"`, s);
    }
    const token = match[0];
    return Parser.ok(token, s.slice(token.length));
  });

const ws = r(/\s*/);
const period = r(/。/);
const quoted = r(/(「|『).+?(」|』)/).map((r) => r.slice(1, -1));
const self = r(/吾/).map(() => "__self__");
const attrPath = r(/之/).apr(quoted).sep(ws);
const variablePath = Parser.noop().or(() =>
  Parser.pure((root: any) => (path: string[]) => [root, ...path])
    .ap(quoted.or(() => self))
    .ap(attrPath)
);

function sequence(actions: Eff[]): Eff {
  return actions.reduce((prev, cur) => prev.bind(() => cur), noop);
}

const block = Parser.noop<Eff>().or(() =>
  Parser.pure(sequence)
    .apl(r(/曰(「|『)/))
    .apl(ws)
    .ap(instruction.sep(ws))
    .apl(ws)
    .apl(r(/(」|』)/))
);

const conditional = Parser.noop<Eff>()
  .or(() =>
    Parser.pure(COND)
      .apl(r(/然。/))
      .apl(ws)
      .ap(block)
      .apl(ws)
      .apl(r(/不然。/))
      .apl(ws)
      .ap(block)
  )
  .or(() =>
    Parser.pure((alt: Eff) => COND(noop)(alt))
      .apl(r(/不然。?/))
      .apl(ws)
      .ap(block)
  )
  .or(() =>
    Parser.pure((cons: Eff) => COND(cons)(noop))
      .apl(r(/然。?/))
      .apl(ws)
      .ap(block)
  );

const defineMethod = Parser.noop<Eff>().or(() =>
  Parser.pure(HANDLE).apl(r(/聞/)).ap(quoted).apl(r(/而/)).ap(block)
);

const applyMethod = Parser.noop<Eff>()
  .or(() =>
    Parser.pure(SEND_MSG)
      .apl(r(/望/))
      .ap(variablePath)
      .ap(quoted)
      .apl(r(/之?/))
      .apl(period)
  )
  .or(() =>
    Parser.pure(SEND_MSG(["__self__"]))
      .apl(r(/吾欲/))
      .ap(quoted)
      .apl(r(/之?/))
      .apl(period)
  );

const loadVar = Parser.noop<Eff>().or(() =>
  Parser.pure(LOAD_VAR)
    .apl(r(/吾?有彼/))
    .ap(variablePath)
    .apl(period)
);

const resetAndloadVar = Parser.noop<Eff>().or(() =>
  Parser.pure(RST_VAR).apl(r(/夫/)).ap(variablePath).apl(period)
);

const loadConst = Parser.noop<Eff>()
  .or(() =>
    Parser.pure(LOAD_CONST)
      .apl(r(/有數曰/))
      .ap(quoted.map(Number))
      .apl(period)
  )
  .or(() =>
    Parser.pure(LOAD_CONST)
      .apl(r(/有言曰/))
      .ap(quoted)
      .apl(period)
  );

const evalExpression = Parser.noop<Eff>().or(() =>
  Parser.pure(EVAL)
    .apl(r(/誦/))
    .ap(quoted)
    .apl(r(/而生一物/))
    .apl(period)
);

const domNode = Parser.noop<Eff>().or(() =>
  Parser.pure(NODE).apl(r(/有/)).ap(quoted).apl(period)
);

const applyOperator = Parser.noop<Eff>().or(() =>
  Parser.pure(APPLY_OP)
    .apl(r(/請/))
    .apl(ws)
    .ap(quoted)
    .apl(ws)
    .apl(r(/之?/))
    .apl(period)
);

const applyFunction = Parser.noop<Eff>().or(() =>
  Parser.pure(APPLY_FUNC)
    .apl(r(/請君/))
    .apl(ws)
    .ap(quoted)
    .apl(r(/之?/))
    .apl(period)
);

const storeVar = Parser.noop<Eff>()
  .or(() =>
    Parser.pure(STORE_VAR)
      .apl(r(/彼?/))
      .ap(variablePath)
      .apl(r(/當如是/))
      .apl(period)
  )
  .or(() =>
    Parser.pure(STORE_VAR)
      .apl(r(/是為|或曰/))
      .ap(variablePath)
      .apl(period)
  );

const setProperty = Parser.noop<Eff>()
  .or(() =>
    Parser.pure(SETP_VAR)
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
    Parser.pure(SETP_VAL)
      .apl(r(/其/))
      .ap(quoted)
      .apl(r(/者/))
      .apl(period)
      .apl(ws)
      .ap(quoted)
      .apl(r(/也/))
      .apl(period)
  )
  .or(() =>
    Parser.pure(SETP_VAL).apl(r(/其?/)).ap(quoted).ap(quoted).apl(period)
  );

const setCursor = Parser.pure<Eff>(SET_CURSOR).apl(r(/内/));

const instruction = Parser.noop<Eff>()
  .or(() => block)
  .or(() => conditional)
  .or(() => defineMethod)
  .or(() => applyMethod)
  .or(() => loadVar)
  .or(() => resetAndloadVar)
  .or(() => loadConst)
  .or(() => evalExpression)
  .or(() => domNode)
  .or(() => applyOperator)
  .or(() => applyFunction)
  .or(() => storeVar)
  .or(() => setProperty)
  .or(() => setCursor);

export const program = Parser.pure(sequence)
  .apl(ws)
  .ap(instruction.sep(ws))
  .apl(ws);
