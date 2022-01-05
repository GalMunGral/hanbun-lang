module Main where

import Prelude

import Effect (Effect)
import Freer (eff, run)
import Machine (Instruction(..), execute)
 
main :: Effect Unit
main = do
    _ <- run execute do
      eff Peek
      eff $ Pop
      
    pure unit