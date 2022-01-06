module Test.Main where

import Prelude

import Control.Monad.Except (ExceptT(..))
import Effect (Effect)
import Effect.Class.Console (logShow)
import Parser (regexParser, runParser)
import Syntax (path, quote)


main :: Effect Unit
main = do
    -- logShow $ runParser (regexParser "he.world") "hexworld"
    -- logShow $ runParser quote "『xwor』ld"
    logShow $ runParser path "「甲」之「乙」之「丙」"
    logShow $ runParser path "吾之「甲」之「乙」之「丙」"
    pure unit

