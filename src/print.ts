import { AST } from "./types";

function indent(str: string, indent: number) {
  return " ".repeat(indent) + str;
}

export function printAll(block: AST[], n = 0) {
  return block.map((inst) => print(inst, n)).join("\n");
}

export function print(inst: AST, n = 0) {
  switch (inst.type) {
    case "SET_CURSOR": {
      return indent("SET CURSOR", n);
    }
    case "RST": {
      return indent("RST", n);
    }
    case "RST_VAR": {
      return indent(`RST_VAR ${inst.path}`, n);
    }
    case "LOAD_VAR": {
      return indent(`LOAD_VAR ${inst.path}`, n);
    }
    case "STORE_VAR": {
      return indent(`STORE_VAR ${inst.path}`, n);
    }
    case "EVAL_EXPR": {
      return indent(`EVAL_EXPR ${inst.value}`, n);
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
