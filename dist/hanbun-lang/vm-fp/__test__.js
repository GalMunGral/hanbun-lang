import { APPLY_OP, COND, DEBUG, HANDLE, LOAD_CONST, LOAD_VAR, SEND_MSG, SET_VAL, SET_VAR, STORE, STORE_VAR, RUN, } from "./index.js";
import { PEEK } from "./Operations.js";
const test = LOAD_CONST({})
    .bind(() => STORE_VAR(["person"]))
    .bind(() => SET_VAL("NAME", "SAM"))
    .bind(() => STORE(["年", "方", "幾", "何"], 18))
    .bind(() => SET_VAR("AGE", ["年", "方", "幾", "何"]))
    .bind(() => PEEK())
    .bind(DEBUG("TEST"));
RUN(test, [], {});
const main = LOAD_CONST({})
    .bind(() => STORE_VAR(["君"]))
    .bind(() => HANDLE("階乘", PEEK()
    .bind(() => STORE_VAR(["數"]))
    .bind(() => LOAD_CONST(2))
    .bind(() => APPLY_OP("<"))
    .bind(() => COND(LOAD_VAR(["數"]), LOAD_VAR(["數"])
    .bind(() => LOAD_VAR(["數"]))
    .bind(() => LOAD_CONST(1))
    .bind(() => APPLY_OP("-"))
    .bind(() => SEND_MSG(["君"], "階乘"))
    .bind(() => APPLY_OP("*"))))))
    .bind(() => LOAD_CONST(16)
    .bind(() => SEND_MSG(["君"], "階乘"))
    .bind(DEBUG("RESULT2")));
RUN(main, [], {});
