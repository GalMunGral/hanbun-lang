module Machine
  ( Instruction(..)
  , binOp
  , execute
  , newContext
  , pop
  , pushRef
  , pushVal
  , restoreContext
  , setRef
  , setVal
  , store
  , test
  )
  where

import Prelude

import Control.Monad.Except (ExceptT(..), throwError)
import Data.Either (Either(..))
import Data.Function.Uncurried (Fn1, Fn2, Fn3, Fn4, runFn2, runFn3)
import Effect.Unsafe (unsafePerformEffect)
import Foreign (Foreign, fail)
import Freer (Eff, eff, run)


data Instruction = Noop | Test | Pop |
    PushVal String | PushRef (Array String) | BinOp String |
    NextContext | RestoreContext | Store |
    SetVal (Array String) String |
    SetRef (Array String) (Array String) |
    Run (Eff Instruction Unit Unit)

type Op = forall m. ExceptT String m Boolean

foreign import test :: Fn2 (String -> Op) (Boolean -> Op) Op
foreign import pop :: Fn2 (String -> Op) (Unit -> Op) Op
foreign import pushVal :: Fn3 String (String -> Op) (Unit -> Op) Op
foreign import pushRef :: Fn3 (Array String) (String -> Op) (Unit -> Op) Op
foreign import binOp :: Fn3 String (String -> Op) (Unit -> Op) Op
foreign import newContext :: Fn1 Unit Unit
foreign import restoreContext :: Fn1 Unit Unit
foreign import store :: Fn3 (Array String) (String -> Op) (Unit -> Op) Op
foreign import setVal :: Fn4 (Array String) (String) (String -> Op) (Unit -> Op) Op
foreign import setRef :: Fn4 (Array String) (Array String) (String -> Op) (Unit -> Op) Op

execute :: Instruction -> Op
execute Noop = pure true
execute Test = runFn2 test throwError pure
execute (PushVal json) = runFn3 pushVal json throwError (pure <<< const true)

    -- PushVal String | PushRef (Array String) | BinOp String |
    -- NextContext | RestoreContext | Store |
    -- SetVal (Array String) String |
    -- SetRef (Array String) (Array String) |
--     -- Run (Eff Instruction Unit Unit)
-- execute Pop = runFn2 pop Left (Right <<< const true)
-- execute Pop = runFn2 pop Left (Right <<< const true)
-- execute Pop = runFn2 pop Left (Right <<< const true)
-- execute Pop = runFn2 pop Left (Right <<< const true)
-- execute Pop = runFn2 pop Left (Right <<< const true)
-- execute Pop = runFn2 pop Left (Right <<< const true)

