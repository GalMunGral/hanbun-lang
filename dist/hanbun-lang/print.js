export function printAll(block, indent = 0) {
    return block.map((inst) => " ".repeat(indent) + print(inst)).join("\n");
}
export function print(inst) {
    switch (inst.type) {
        case "SET_CURSOR": {
            return "SET CURSOR";
        }
        case "RST": {
            return "RST";
        }
        case "RST_VAR": {
            return `RST_VAR ${inst.path}`;
        }
        case "LOAD_VAR": {
            return `LOAD_VAR ${inst.path}`;
        }
        case "STORE_VAR": {
            return `STORE_VAR ${inst.path}`;
        }
        case "EVAL_EXPR": {
            return `EVAL_EXPR ${inst.value}`;
        }
        case "LOAD_CONST": {
            return `LOAD_CONST ${inst.value}`;
        }
        case "NODE": {
            return `NODE ${inst.tag}`;
        }
        case "SET_PROP": {
            return `SET_PROP ${inst.name} ${inst.path || inst.literal}`;
        }
        case "BLOCK": {
            return `BLOCK_START\n${printAll(inst.body, 2)}\nBLOCK_END`;
        }
        case "COND": {
            let res = "IF_TRUE";
            if (inst.consequent.length) {
                res += "\n" + printAll(inst.consequent, 2);
            }
            if (inst.alternate.length) {
                res += "\n" + printAll(inst.alternate, 2);
            }
            res += "\nEND_IF";
            return res;
        }
        case "DEFN_MSG": {
            return `DEFN_MSG ${inst.name}\n${printAll(inst.body, 2)}\nDEFN_END`;
        }
        case "SEND_MSG": {
            return `SEND_MSG ${inst.receiver} ${inst.method}`;
        }
        case "APPLY_FUNC": {
            return `APPLY_FUNC ${inst.func}`;
        }
        case "APPLY_OP": {
            return `APPLY_OP ${inst.op}`;
        }
        default:
            return "";
    }
}
