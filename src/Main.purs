module Main where

import Prelude

import Effect (Effect)
import Effect.Class.Console (log)
import Freer (Eff(..), eff, run)
  

data Test = YO | HEY | HA

instance showTEST :: Show Test where
  show YO = "YO"
  show HEY = "HEY"
  show HA = "HA"

handler :: Test -> Effect Unit
handler t = log $ show t

main :: Effect Unit
main = do
    _ <- run handler (eff YO *> eff HEY *> eff HA)
    pure unit