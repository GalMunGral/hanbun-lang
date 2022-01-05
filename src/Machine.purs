module Machine where

import Prelude

import Control.Monad.Except (Except, throwError)
import Data.Either (Either(..))
import Data.Function.Uncurried (Fn2, Fn3, Fn4, runFn1, runFn2, runFn3, runFn4)
import Effect.Class.Console (log)
import Effect.Unsafe (unsafePerformEffect)
import Freer (Eff, run)


type Operation = Either String Unit
type Block = Eff Instruction Unit Unit

data Instruction = Noop 
    | Debug 
    | Pop 
    | LoadVal String 
    | LoadRef (Array String) 
    | BinOp String
    | MakeNode String
    | Store (Array String) 
    | SetVal (Array String) String 
    | SetRef (Array String) (Array String) 
    | Select Block Block
    | Register String Block 
    | Call (Array String) String

instance instructinoShow :: Show Instruction where
    show Noop = "Noop"
    show Debug = "Debug"
    show Pop = "Pop"
    show (LoadVal v) = "loadVal(" <> v <> ")"
    show (LoadRef path) = "LoadRef(" <> show path <> ")"
    show (BinOp op) = "BinOp(" <> op <> ")"
    show (MakeNode tag) = "MakeNode(" <> tag <> ")"
    show (Store path) = "Store(" <> show path <> ")"
    show (SetVal path v) = "SetVal(" <> show path <> "," <> show v <> ")" 
    show (SetRef path ref) = "SetRef(" <> show path <> "," <> show ref <> ")"
    show (Select _ _) = "Select"
    show (Register message _) = "Register(" <> message <> ")"
    show (Call path message) = "Call(" <> show path <> "," <> message <> ")"


foreign import debug :: (Unit -> Operation) -> Operation
foreign import pop :: Fn2 (String -> Operation) (Unit -> Operation) Operation
foreign import loadVal :: Fn3 String (String -> Operation) (Unit -> Operation) Operation
foreign import loadRef :: Fn3 (Array String) (String -> Operation) (Unit -> Operation) Operation
foreign import binOp :: Fn3 String (String -> Operation) (Unit -> Operation) Operation
foreign import store :: Fn3 (Array String) (String -> Operation) (Unit -> Operation) Operation
foreign import makeNode :: Fn3 String (String -> Operation) (Unit -> Operation) Operation
foreign import setVal :: Fn4 (Array String) (String) (String -> Operation) (Unit -> Operation) Operation
foreign import setRef :: Fn4 (Array String) (Array String) (String -> Operation) (Unit -> Operation) Operation
foreign import select :: Fn2 (Unit -> Operation) (Unit -> Operation) Operation
foreign import register :: Fn4 String (Unit -> Operation) (String -> Operation) (Unit -> Operation) Operation
foreign import call :: Fn4 (Array String) String (String -> Operation) (Unit -> Operation) Operation

execute :: Instruction -> Operation
execute Noop = pure unit
execute Debug = runFn1 debug pure
execute Pop = runFn2 pop (throwError <<< ("[POP]" <> _)) pure
execute (LoadVal json) = runFn3 loadVal json (throwError <<< ("[loadVal]" <> _)) pure
execute (LoadRef path) = runFn3 loadRef path (throwError <<< ("[LoadRef]" <> _)) pure
execute (BinOp op) = runFn3 binOp op (throwError <<< ("[BinOp]" <> _)) pure
execute (Store path) = runFn3 store path (throwError <<< ("[Store]" <> _)) pure
execute (MakeNode tag) = runFn3 makeNode tag (throwError <<< ("[MakeNode]" <> _)) pure
execute (SetVal path json) = runFn4 setVal path json (throwError <<< ("[SetVal]" <> _)) pure
execute (SetRef path from) = runFn4 setRef path from (throwError <<< ("[SetRef]" <> _)) pure
execute (Select block1 block2) = let 
    thunk block = \_ -> run execute block in
    runFn2 select (thunk block1) (thunk block2)
execute (Call path message) = runFn4 call path message (throwError <<< ("[Call]" <> _)) pure
execute (Register message block) = runFn4 register message
    (\_ -> case run execute block of
        (Left msg) -> pure $ unsafePerformEffect $ log msg
        (Right _) -> pure unit)
    (throwError <<< ("[Register]" <> _)) pure

