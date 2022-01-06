module Parser where

import Prelude
import Control.Alternative (class Alt, (<|>))
import Data.Array ((!!), (:))
import Data.Array.NonEmpty (toArray)
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Either (Either)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String (drop, length)
import Data.String.CodeUnits (slice)
import Data.String.Regex (Regex, match, regex)
import Data.String.Regex.Flags (noFlags)
import Data.String.Regex.Unsafe (unsafeRegex)

data Res a
  = Ok a String
  | Err String String

instance resShow :: Show a => Show (Res a) where
  show (Ok a s) = "Ok(" <> show a <> "," <> s <> ")"
  show (Err e s) = "Err(" <> e <> "," <> s <> ")"

instance resFunctor :: Functor Res where
  map f (Ok a next) = Ok (f a) next
  map _ (Err e next) = Err e next

instance resApply :: Apply Res where
  apply (Ok f _) (Ok a s2) = Ok (f a) s2
  apply (Err e s) _ = Err e s
  apply _ (Err e s) = Err e s

instance resBind :: Bind Res where
  bind (Ok a _) f = f a
  bind (Err e next) _ = Err e next

newtype Parser a
  = Parser { runParser :: String -> Res a }

noop :: forall a. Parser a
noop = Parser { runParser: \s -> Err "" s }

instance parserFunctor :: Functor Parser where
  map f (Parser a) = Parser { runParser: \s -> map f $ a.runParser s }

instance parserApplicative :: Applicative Parser where
  pure a = Parser { runParser: \s -> Ok a s }

instance parserAlternative :: Alt Parser where
  alt (Parser a) (Parser b) =
    Parser
      { runParser:
          \s -> case a.runParser s of
            (Ok u next) -> Ok u next
            (Err _ _) -> b.runParser s
      }

altLazy :: forall a. Parser a -> (Unit -> Parser a) -> Parser a
altLazy (Parser a) thunk =
  Parser
    { runParser:
        \s -> case a.runParser s of
          (Ok u next) -> Ok u next
          (Err _ _) -> runParser (thunk unit) s
    }

infixl 3 altLazy as <||>

instance parserApply :: Apply Parser where
  apply (Parser a) (Parser b) =
    Parser
      { runParser:
          \s -> case a.runParser s of
            (Err e s') -> Err e s'
            (Ok f s') -> case b.runParser s' of
              (Err e s'') -> Err e s''
              (Ok x s'') -> Ok (f x) s''
      }

runParser :: forall a. Parser a -> String -> Res a
runParser (Parser a) s = a.runParser s

repeat :: forall a. Parser a -> Parser (Array a)
repeat (Parser a) =
  Parser
    { runParser:
        \s ->
          let
            res = a.runParser s
          in
            case res of
              (Err _ _) -> Ok [] s
              (Ok _ s') -> (:) <$> res <*> runParser rest s'
                where
                rest = repeat $ Parser a
    }

sepBy :: forall a b. Parser a -> Parser b -> Parser (Array b)
sepBy (Parser a) (Parser b) =
  Parser
    { runParser:
        \s ->
          let
            res = b.runParser s
          in
            case res of
              (Err _ _) -> Ok [] s
              (Ok _ s') -> (:) <$> res <*> runParser rest s'
                where
                rest = repeat $ Parser a *> Parser b
    }

re :: String -> Parser String
re rs =
  let
    pattern = unsafeRegex ("^" <> rs) noFlags
  in
    Parser
      { runParser:
          \s -> case match pattern s >>= \a -> join $ (toArray a) !! 0 of
            (Just token) -> Ok token $ drop (length token) s
            Nothing -> Err "Failed to parse" s
      }
