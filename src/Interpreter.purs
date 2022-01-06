module Syntax where

import Prelude

import Control.Alt (class Alt, (<|>))
import Data.Array ((:))
import Data.Maybe (fromMaybe)
import Data.String.CodeUnits (slice)
import Parser (Parser(..), regexParser, sepBy)


ws :: Parser String
ws = regexParser """\s*"""

period :: Parser String
period = regexParser """\s*(。?)\s*"""

quote :: Parser String
quote = fromMaybe "" <<< slice 1 (-1) <$> regexParser """(「|『).+?(」|』)"""

this :: Parser String
this = const "this" <$> regexParser "吾"

path :: Parser (Array String)
path = (:) <$> (quote <|> this) <*> sepBy (regexParser "之" *> quote) ws

-- const attrPath = ;
-- const variablePath = Parser.noop().or(() =>
--   Parser.pure((root: any) => (path: string[]) => [root, ...path])
--     .ap(quoted.or(() => self))
--     .ap(attrPath)
-- );

-- function sequence(actions: Eff[]): Eff {
--   return actions.reduce((prev, cur) => prev.bind(() => cur), eff(NOOP));
-- }

-- const LoadValue = Parser.noop<Eff>()
--   .or(() =>
--     Parser.pure(LOAD_VAL).apl(r(/有|以/)).ap(quoted.map(Number)).apl(period)
--   )
--   .or(() => Parser.pure(LOAD_VAL).apl(r(/有言/)).ap(quoted).apl(period));

-- const LoadVariable = Parser.noop<Eff>().or(() =>
--   Parser.pure(LOAD_VAR)
--     .apl(r(/(取|夫)(其|彼)?/))
--     .ap(variablePath)
--     .apl(period)
-- );

-- const Operate = Parser.noop<Eff>().or(() =>
--   Parser.pure(OPERATE).ap(quoted).apl(ws).apl(r(/之?/)).apl(period)
-- );

-- const StoreVariable = Parser.noop<Eff>()
--   .or(() =>
--     Parser.pure(STORE_VAR)
--       .apl(r(/今/))
--       .ap(variablePath)
--       .apl(r(/如是|亦然/))
--       .apl(period)
--   )
--   .or(() =>
--     Parser.pure(STORE_VAR).apl(r(/是?謂/)).ap(variablePath).apl(period)
--   );

-- const Block = Parser.noop<Eff>().or(() =>
--   Parser.pure(sequence)
--     .apl(r(/「|『/))
--     .apl(ws)
--     .ap(instruction.sep(ws))
--     .apl(ws)
--     .apl(r(/」|』/))
-- );

-- const Conditional = Parser.noop<Eff>()
--   .or(() =>
--     Parser.pure(COND)
--       .apl(r(/然/))
--       .apl(period)
--       .apl(ws)
--       .ap(Block)
--       .apl(ws)
--       .apl(r(/不然/))
--       .apl(period)
--       .apl(ws)
--       .ap(Block)
--   )
--   .or(() =>
--     Parser.pure((alt: Eff) => COND(eff(NOOP))(alt))
--       .apl(r(/不然/))
--       .apl(period)
--       .apl(ws)
--       .ap(Block)
--   )
--   .or(() =>
--     Parser.pure((cons: Eff) => COND(cons)(eff(NOOP)))
--       .apl(r(/然/))
--       .apl(period)
--       .apl(ws)
--       .ap(Block)
--   );

-- const NewNode = Parser.noop<Eff>().or(() =>
--   Parser.pure(NODE).apl(r(/有此/)).ap(quoted).apl(period)
-- );

-- const SetMember = Parser.noop<Eff>()
--   .or(() =>
--     Parser.pure(SET_MEM_VAR)
--       .apl(r(/其/))
--       .ap(quoted)
--       .apl(r(/者/))
--       .apl(ws)
--       .apl(r(/彼/))
--       .ap(variablePath)
--       .apl(r(/也/))
--       .apl(period)
--   )
--   .or(() =>
--     Parser.pure(SET_MEM_VAL)
--       .apl(r(/其/))
--       .ap(quoted)
--       .apl(r(/也?/))
--       .apl(ws)
--       .ap(quoted)
--       .apl(period)
--   );

-- const MessageDefinition = Parser.noop<Eff>().or(() =>
--   Parser.pure(MSG_DEF)
--     .apl(r(/聞/))
--     .ap(quoted)
--     .apl(r(/則答曰/))
--     .ap(Block)
-- );

-- const MessageSend = Parser.noop<Eff>()
--   .or(() =>
--     Parser.pure(MSG_SEND)
--       .apl(r(/願彼?/))
--       .ap(variablePath)
--       .ap(quoted)
--       .apl(r(/之/))
--       .apl(period)
--   )
--   .or(() =>
--     Parser.pure(MSG_SEND)
--       .apl(r(/彼/))
--       .ap(variablePath)
--       .apl(r(/其/))
--       .ap(quoted)
--       .apl(r(/者何/))
--       .apl(period)
--   )
--   .or(() =>
--     Parser.pure(MSG_SEND(["__self__"]))
--       .apl(r(/吾(欲|當)/))
--       .ap(quoted)
--       .apl(r(/之?/))
--       .apl(period)
--   )
--   .or(() =>
--     Parser.pure(MSG_SEND(["window"]))
--       .apl(r(/請/))
--       .apl(ws)
--       .ap(quoted)
--       .apl(r(/之/))
--       .apl(period)
--   );

-- const instruction = Parser.noop<Eff>()
--   .or(() => Block)
--   .or(() => Conditional)
--   .or(() => MessageDefinition)
--   .or(() => MessageSend)
--   .or(() => LoadVariable)
--   .or(() => LoadValue)
--   .or(() => NewNode)
--   .or(() => Operate)
--   .or(() => StoreVariable)
--   .or(() => SetMember);

-- export const program = Parser.pure(sequence)
--   .apl(ws)
--   .ap(instruction.sep(ws))
--   .apl(ws);
