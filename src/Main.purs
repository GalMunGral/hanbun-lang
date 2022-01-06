module Main where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Traversable (sequence, traverse)
import Effect (Effect)
import Effect.Class.Console (logShow)
import Freer (Eff, eff, unsafeRun)
import Machine (Block, Instruction(..), execute)
import Parser (Parser(..), Res(..), runParser)
import Syntax (instruction, program)
import Web.DOM.Element (toNode)
import Web.DOM.Node (textContent)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toParentNode)
import Web.HTML.Window (document)


-- document
--   .querySelectorAll('script[type="text/hanbun"]')
--   .forEach((el) => unsafeInterpret(el.textContent));

unsafeInterpret :: String -> Effect Unit
unsafeInterpret s = let
    res = runParser program s in
    case res of
        (Ok ops _) -> do
            logShow ops
            let runnable = map (const unit) $ traverse eff ops
            const unit <$> (pure $ unsafeRun execute runnable)
        (Err e s') -> logShow (e <> "," <> s')

main :: Effect Unit
main = do
    win <- window
    doc <-document win
    el <- querySelector (QuerySelector "#script") (toParentNode doc)
    script <- case el of
        Just e -> (textContent <<< toNode) e
        Nothing -> pure ""
    unsafeInterpret script
