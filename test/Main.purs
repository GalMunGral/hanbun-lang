module Test.Main
  ( main
  )
  where

import Prelude

import Control.Monad.Except (runExceptT)
import Control.Monad.State (StateT, get, put, runStateT)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Class.Console (log)
import Foreign (Foreign, readUndefined)

foreign import getPath :: forall a. Array String -> Foreign

p :: StateT Int Effect Unit
p = do
  s <- get
  (log <<< show) s
  put 1
  s1 <- get
  (log <<< show) s1
  a <- runExceptT (readUndefined (getPath [ "a", "b", "d" ]))
  case a of
    (Left e) -> log (show e)
    (Right v) -> case v of
      (Nothing) -> log "NOTHING"
      (Just u) -> log "yo"
  log "YO"

main :: Effect Unit
main = do
  _ <- runStateT p 100
  pure unit
