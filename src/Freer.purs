module Freer where

import Prelude

data Ff e a b = Ff (e) (a -> b)

instance showFf :: Show e => Show (Ff e a b) where
    show (Ff e _) = "Ff{ " <> show e <> " }"

instance functorFf :: Functor (Ff e a) where
    map f (Ff e g) = Ff e (g >>> f)

data Eff e a b =  Pure b | Impure (Ff e a (Eff e a b))

instance showEff :: (Show e, Show b) => Show (Eff e a b) where
    show (Pure b) = "Pure{ " <> show b <> " }"
    show (Impure fb) = "Impure{ " <> show fb <> " }"

instance effFunctor :: Functor (Eff e a) where
    map f (Pure b) = Pure $ f b
    map f (Impure fb) = Impure $ map (map f) fb

instance effApply :: Apply (Eff e a) where
    apply (Pure a) (Pure b) = Pure (a b)
    apply (Impure fa) b = Impure $ map (flip apply b) fa
    apply a (Impure fb) = Impure $ map (apply a) fb

instance effMonad :: Bind (Eff e a) where
    bind (Pure b) f = f b
    bind (Impure fb) f = Impure $ map (flip bind f) fb

eff :: forall e a. e -> Eff e a a
eff e = Impure (Ff e Pure)

run :: forall e a b m. Monad m => (e -> m a) -> Eff e a b -> m b
run _ (Pure b) = pure b
run f (Impure (Ff e g)) = f e >>= \a -> run f (g a)

