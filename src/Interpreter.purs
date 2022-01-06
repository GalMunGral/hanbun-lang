module Syntax where

import Prelude

import Control.Alt (class Alt, (<|>))
import Data.Array ((:), (!!))
import Data.Array.NonEmpty (toArray)
import Data.Int (fromString)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String (drop, length)
import Data.String.CodeUnits (slice)
import Data.String.Regex (match, regex)
import Data.String.Regex.Flags (noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)
import Data.Traversable (sequence)
import Freer (eff)
import Machine (Block, Instruction(..), loadVal, setRef)
import Parser (Parser(..), Res(..), noop, re, sepBy, (<||>))

ws :: Parser String
ws = re """\s*"""

period :: Parser String
period = re """\s*(。?)\s*"""

identifier :: Parser String
identifier = fromMaybe "" <<< slice 1 (-1) <$> re """(「|『).+?(」|』)"""

this :: Parser String
this = const "this" <$> re "吾"

path :: Parser (Array String)
path = (:) <$> (identifier <|> this) <*> sepBy ws (re "之" *> identifier)

program :: Parser (Array Instruction)
program = ws *> sepBy ws instruction <* ws

instruction :: Parser Instruction 
instruction = loadValue
    <|> loadVariable
    <|> binaryOperation
    <|> storeVariable
    <|> makeNode 
    <|> setMember
    <|> call
    <||> \_ -> register
    <||> \_ -> selection

loadValue :: Parser Instruction
loadValue = const (LoadVal) <$> re "(有|以)" <*> identifier <* period
    <|> const (LoadVal <<< quote) <$> re "有言" <*> identifier <* period
        where quote s = "\"" <> s <> "\""

loadVariable :: Parser Instruction
loadVariable = const (LoadRef) <$> re "(取|夫)(其|彼)?" <*> path <* period

binaryOperation :: Parser Instruction
binaryOperation = BinOp <$> identifier <* re "之" <* period

storeVariable :: Parser Instruction
storeVariable = const Store <$> re "今" <*> path <* re "(如是|亦然)" <* period
    <|> const Store <$> re "是?謂" <*> path <* period

makeNode :: Parser Instruction
makeNode = const MakeNode <$> re "有此" <*> identifier <* period

setMember :: Parser Instruction
setMember = const SetRef <$> re "其" <*> identifier <* re "者" <* ws <* re "彼" <*> path <* re "也" <* period
    <|> const SetVal <$> re "其" <*> identifier <* re "也?" <* ws <*> identifier <* period

block :: Parser (Array Instruction)
block = noop <||> \_ ->
    re "「|『" *> ws *> (sepBy ws (instruction)) <* ws <* re "」|』"

selection :: Parser Instruction
selection = noop <||> \_ ->
    const Select <$> re "然" <* period <* ws <*> block <* ws <* re "不然" <* period <*> block
        <|> const (flip Select []) <$> re "然" <* period <*> block
        <|> const (Select []) <$> re "不然" <* period <*> block

register :: Parser Instruction
register = noop <||> \_ ->
    const Register <$> re "聞" <*> identifier <* re "則答曰" <*> block

call :: Parser Instruction
call = const Call <$> re "願彼?" <*> path <*> identifier <* re "之?" <* period
    <|> const Call <$> re "彼" <*> path <* re "其" <*> identifier <* re "者何" <* period
    <|> const (Call ["this"]) <$> re "吾(欲|當)" <*> identifier <* re "之?" <* period
    <|> const (Call ["globalThis"]) <$> re "請" <*> identifier <* re "之?" <* period
