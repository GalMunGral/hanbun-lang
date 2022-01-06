module Freer where

import Prelude
import Data.Either (Either(..))
import Effect.Class.Console (logShow)
import Effect.Unsafe (unsafePerformEffect)

data F e a b
  = F (e) (a -> b)

instance showF :: Show e => Show (F e a b) where
  show (F e _) = "F(" <> show e <> ")"

instance functorF :: Functor (F e a) where
  map f (F e g) = F e (g >>> f)

data Eff e a b
  = Pure b
  | Impure (F e a (Eff e a b))

instance showEff :: (Show e, Show b) => Show (Eff e a b) where
  show (Pure b) = "Pure(" <> show b <> ")"
  show (Impure fb) = "Impure(" <> show fb <> ")"

instance effFunctor :: Functor (Eff e a) where
  map f (Pure b) = Pure $ f b
  map f (Impure fb) = Impure $ map (map f) fb

instance effApply :: Apply (Eff e a) where
  apply (Pure a) (Pure b) = Pure (a b)
  apply (Impure fa) b = Impure $ map (flip apply b) fa
  apply a (Impure fb) = Impure $ map (apply a) fb

instance effBind :: Bind (Eff e a) where
  bind (Pure b) f = f b
  bind (Impure fb) f = Impure $ map (flip bind f) fb

instance effApplicative :: Applicative (Eff e a) where
  pure a = Pure a

instance effMonad :: Monad (Eff e a)

eff :: forall e a. e -> Eff e a a
eff e = Impure (F e Pure)

unsafeRun :: forall e a b. Show e => (e -> Either String a) -> Eff e a b -> Either String b
unsafeRun _ (Pure b) = pure b

unsafeRun f (Impure (F e g)) = case f e of
  (Left err) -> Left $ const "ERROR" $ unsafePerformEffect $ logShow err
  (Right a) -> unsafeRun f (g a)
