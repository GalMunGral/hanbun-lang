function indent(str, indent) {
  return " ".repeat(indent) + str;
}
export function printAll(block, n = 0) {
  return block.map((inst) => print(inst, n)).join("\n");
}
export function print(inst, n = 0) {
  switch (inst.type) {
    case "SET_CURSOR": {
      return indent("SET CURSOR", n);
    }
    case "RST": {
      return indent("RST", n);
    }
    case "RST_VAR": {
      return indent(`RST_VAR ${inst.path.join("/")}`, n);
    }
    case "LOAD_VAR": {
      return indent(`LOAD_VAR ${inst.path.join("/")}`, n);
    }
    case "STORE_VAR": {
      return indent(`STORE_VAR ${inst.path.join("/")}`, n);
    }
    case "EVAL_EXPR": {
      return indent(`EVAL_EXPR ${inst.value}`, n);
    }
    case "LOAD_CONST": {
      return indent(`LOAD_CONST ${inst.value}`, n);
    }
    case "NODE": {
      return indent(`NODE ${inst.tag}`, n);
    }
    case "SET": {
      return indent(
        `SET ${inst.name} ${inst.literal || inst.path.join("/")}`,
        n
      );
    }
    case "BLOCK": {
      return (
        indent("BLOCK_START", n) +
        "\n" +
        printAll(inst.body, n + 2) +
        "\n" +
        indent("BLOCK_END", n)
      );
    }
    case "COND": {
      let res = indent("IF_TRUE", n);
      if (inst.consequent.length) {
        res += "\n" + printAll(inst.consequent, n + 2);
      }
      if (inst.alternate.length) {
        res +=
          "\n" + indent("ELSE", n) + "\n" + printAll(inst.alternate, n + 2);
      }
      res += "\n" + indent("END_IF", n);
      return res;
    }
    case "HANDLE": {
      return (
        indent(`HANDLE ${inst.name}`, n) +
        "\n" +
        printAll(inst.body, n + 2) +
        "\n" +
        indent("END", n)
      );
    }
    case "SEND_MSG": {
      return indent(`SEND_MSG ${inst.receiver.join("/")} ${inst.method}`, n);
    }
    case "APPLY_FUNC": {
      return indent(`APPLY_FUNC ${inst.func}`, n);
    }
    case "APPLY_OP": {
      return indent(`APPLY_OP ${inst.op}`, n);
    }
    default:
      return "";
  }
}
