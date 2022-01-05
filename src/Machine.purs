module Machine where

import Prelude

import Freer (Eff)

data Op = Add | Subtract | Multiply | Divide
data Instruction a b = Noop | Error String |
    Peek | Pop | Push a | BinOp Op a b |
    GetEnv | PutEnv a | LookUp (Array String) |
    Update a (Array String) b | UpdateRoot (Array String) b |
    Run (Eff a b b)

foreign import peek :: Unit -> Unit

execute :: forall a b m. Monad m => Instruction a b -> m Unit
execute Noop = pure unit
execute (Error _) = pure unit
execute Peek = pure (peek unit)
execute _ = pure unit

-- export class Instance {
--   private stack: any[] = [];
--   private env: any = window;

--   public run(m: Eff<any>) {
--     if (m instanceof Pure) return;
--     const { eff, cont } = m.functor;
--     this.run(cont(this.handle(eff)));
--   }

--   private handle(
--     eff:
--       | ERROR
--       | PEEK
--       | POP
--       | PUSH
--       | BINOP
--       | GET_ENV
--       | PUT_ENV
--       | LOOKUP
--       | SAFE_LOOKUP
--       | UPDATE
--       | UPDATE_ROOT
--   ): any {
--     if (eff == NOOP) return;
--     if (eff instanceof ERROR) {
--       throw eff.message;
--     }
--     if (eff instanceof POP) {
--       return this.stack.pop();
--     }
--     if (eff instanceof PEEK) {
--       if (!this.stack.length) throw "nothing on stack!";
--       return this.stack[this.stack.length - 1];
--     }
--     if (eff instanceof PUSH) {
--       this.stack.push(eff.val);
--       return;
--     }
--     if (eff instanceof BINOP) {
--       switch (eff.op) {
--         case "<":
--           return eff.left < eff.right;
--         case "<=":
--           return eff.left <= eff.right;
--         case ">":
--           return eff.left > eff.right;
--         case ">=":
--           return eff.left >= eff.right;
--         case "==":
--           return eff.left === eff.right;
--         case "+":
--           return eff.left + eff.right;
--         case "-":
--           return eff.left - eff.right;
--         case "*":
--           return eff.left * eff.right;
--         case "/":
--           return eff.left / eff.right;
--         case "**":
--           return eff.left ** eff.right;
--         default:
--           throw "Operation Not Supported";
--       }
--     }
--     if (eff instanceof GET_ENV) {
--       return this.env;
--     }
--     if (eff instanceof PUT_ENV) {
--       this.env = eff.root;
--       return;
--     }
--     if (eff instanceof LOOKUP) {
--       let cur = this.env;
--       for (let p of eff.path) {
--         if (typeof cur !== "object" || cur === null) return null;
--         cur = cur[p];
--       }
--       return cur;
--     }
--     if (eff instanceof SAFE_LOOKUP) {
--       let cur = this.env;
--       for (let p of eff.path) {
--         if (typeof cur !== "object" || cur === null)
--           throw `${eff.path.join("/")}not found!`;
--         cur = cur[p];
--       }
--       return cur;
--     }
--     if (eff instanceof UPDATE) {
--       if (!eff.path.length) throw "what do you want to update?";
--       let key = eff.path[eff.path.length - 1];
--       let cur = eff.root;
--       for (let p of eff.path.slice(0, -1)) {
--         if (typeof cur[p] !== "object" || cur[p] === null) {
--           cur[p] = {};
--         }
--         cur = cur[p];
--       }
--       cur[key] = eff.value;
--       return;
--     }
--     if (eff instanceof UPDATE_ROOT) {
--       if (!eff.path.length) throw "what do you want to update?";
--       let key = eff.path[eff.path.length - 1];
--       let cur = this.env;
--       for (let p of eff.path.slice(0, -1)) {
--         if (typeof cur[p] !== "object" || cur[p] === null) {
--           cur[p] = {};
--         }
--         cur = cur[p];
--       }
--       cur[key] = eff.value;
--       return;
--     }
--     throw eff;
--   }
-- }
