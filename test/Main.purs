module Test.Main where

import Prelude

import Control.Comonad.Store (Store)
import Control.Monad.Except (runExceptT)
import Data.Either (Either(..))
import Effect (Effect)
import Effect.Class.Console (log, logShow)
import Freer (eff, run)
import Machine (Block, Instruction(..), execute, loadVal)

program :: Block
program = do
    -- eff $ loadVal "1"
    -- eff $ loadVal "2"
    -- eff $ loadVal "0"
    -- eff $ Select
    --     (do eff $ loadVal "4")
    --     (do eff $ loadVal "5"
    --         eff $ loadVal "6")
    -- eff $ loadVal "123"
    -- eff $ Store [ "a", "b", "c" ]
    -- eff $ NewContext
    -- eff $ LoadRef [ "a", "b" ]
    -- eff $ LoadRef [ "globalThis", "performance", "nodeTiming" ]
    -- eff $ MakeNode "test-this"
    -- eff $ SetVal [ "test" ] "12345"
    -- eff $ SetRef [ "test-ref" ] [ "a", "b" ]
    -- eff $ Store [ "d", "e" ]
    -- eff $ loadVal "123"
    -- eff $ Store [ "a", "b", "c" ]
    -- eff $ MakeNode "test-this"
    -- eff $ NewContext
    -- eff $ loadVal "456"
    -- eff $ Store [ "a", "b", "c" ]
    -- eff $ LoadRef [ "a", "b", "c" ]
    -- eff $ Debug
    -- eff $ RestoreContext
    -- eff $ LoadRef [ "a", "b", "c" ]
    -- eff $ Debug
    -- eff $ Call ["console"] "log"
    -- eff $ loadVal "123"
    -- eff $ Debug
    eff $ MakeNode "test-node"
    eff $ SetVal [ "what", "is", "this" ] """ "test" """
    eff $ Register "TestMethod" $ do
        eff $ Store [ "temporary", "argument" ]
        -- eff $ Debug
        eff $ LoadRef [ "temporary", "argument" ]
        eff $ LoadVal "0"
        eff $ LoadVal "0"
        eff $ Call [ "JSON" ] "stringify"
        eff $ Call [ "globalThis" ] "log"
    eff $ Store [ "globalThis", "test", "node" ]
    eff $ LoadVal "{ \"test\": \"test\" }" 
    eff $ Call [ "globalThis", "test", "node" ] "TestMethod"

main :: Effect Unit
main = do
    _ <- case run execute program of
        Left m -> log $ "Error" <> m
        Right _ -> log $ "Success"
    pure unit

