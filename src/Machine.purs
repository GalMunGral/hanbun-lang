module Machine where

import Prelude
import Data.Either (Either(..))
import Data.Function.Uncurried (Fn2, Fn3, Fn4, runFn2, runFn3, runFn4)
import Data.Traversable (traverse)
import Effect.Class.Console (log)
import Effect.Unsafe (unsafePerformEffect)
import Freer (Eff, eff, unsafeRun)

type Operation = Either String Unit

type Block = Eff Instruction Unit Unit

data Instruction
  = Noop
  | LoadVal String
  | LoadRef (Array String)
  | BinOp String
  | MakeNode String
  | Store (Array String)
  | SetVal String String
  | SetRef String (Array String)
  | Select (Array Instruction) (Array Instruction)
  | Register String (Array Instruction)
  | Call (Array String) String

instance instructinoShow :: Show Instruction where
  show Noop = "Noop"
  show (LoadVal v) = "loadVal(" <> v <> ")"
  show (LoadRef path) = "LoadRef(" <> show path <> ")"
  show (BinOp op) = "BinOp(" <> op <> ")"
  show (MakeNode tag) = "MakeNode(" <> tag <> ")"
  show (Store path) = "Store(" <> show path <> ")"
  show (SetVal path v) = "SetVal(" <> show path <> "," <> show v <> ")"
  show (SetRef path ref) = "SetRef(" <> show path <> "," <> show ref <> ")"
  show (Call path message) = "Call(" <> show path <> "," <> message <> ")"
  show (Register message seq) = "Register(" <> message <> "->" <> show seq <> ")"
  show (Select seq1 seq2) = "Select(" <> show seq1 <> "," <> show seq2 <> ")"

foreign import loadVal :: Fn3 String (String -> Operation) (Unit -> Operation) Operation

foreign import loadRef :: Fn3 (Array String) (String -> Operation) (Unit -> Operation) Operation

foreign import binOp :: Fn3 String (String -> Operation) (Unit -> Operation) Operation

foreign import store :: Fn3 (Array String) (String -> Operation) (Unit -> Operation) Operation

foreign import makeNode :: Fn3 String (String -> Operation) (Unit -> Operation) Operation

foreign import setVal :: Fn4 String (String) (String -> Operation) (Unit -> Operation) Operation

foreign import setRef :: Fn4 String (Array String) (String -> Operation) (Unit -> Operation) Operation

foreign import select :: Fn2 (Unit -> Operation) (Unit -> Operation) Operation

foreign import register :: Fn4 String (Unit -> Operation) (String -> Operation) (Unit -> Operation) Operation

foreign import call :: Fn4 (Array String) String (String -> Operation) (Unit -> Operation) Operation

execute :: Instruction -> Operation
execute Noop = pure unit

execute (LoadVal json) = runFn3 loadVal json Left Right

execute (LoadRef path) = runFn3 loadRef path Left Right

execute (BinOp op) = runFn3 binOp op Left Right

execute (Store path) = runFn3 store path Left Right

execute (MakeNode tag) = runFn3 makeNode tag Left Right

execute (SetVal path json) = runFn4 setVal path json Left Right

execute (SetRef path from) = runFn4 setRef path from Left Right

execute (Call path message) = runFn4 call path message Left Right

execute (Register message seq) = runFn4 register message body Left Right
  where
  block = const unit <$> traverse eff seq

  body = \_ -> case unsafeRun execute block of
    (Left msg) -> pure $ unsafePerformEffect $ log msg
    (Right _) -> pure unit

execute (Select seq1 seq2) = runFn2 select block1 block2
  where
  thunk block = \_ -> unsafeRun execute block

  block1 = thunk $ const unit <$> traverse eff seq1

  block2 = thunk $ const unit <$> traverse eff seq2
