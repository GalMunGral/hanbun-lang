module Main where

import Prelude

import Effect (Effect)
import Freer (eff, run)
import Machine (Instruction(..), execute)
import Parser (Parser(..), runParser)


main :: Effect Unit
main = do
    _ <- pure $ run execute do
      eff $ Pop      
    pure unit