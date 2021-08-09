import { Err } from "../lib.js";
import { parser } from "./index.js";
import { AST } from "./types.js";

function last<T>(arr: T[]): T {
  if (arr.length) {
    return arr[arr.length - 1];
  }
  return null;
}

class WenyanVM {
  private stack: any[] = [];
  private cursor: HTMLElement | null = null;

  get(path: string[], context: any) {
    if (path.length == 0) return window;
    const [scope, ...scopedPath] = path;
    const root = scope === "this" ? context : window[scope];
    return scopedPath.reduce((node, name) => node[name], root);
  }

  set(path: string[], value: any, context: any) {
    this.get(path.slice(0, -1), context)[last(path)] = value;
  }

  private execute(inst: AST, context?: any) {
    console.group(inst.type);
    console.debug(inst);
    switch (inst.type) {
      case "SET_CURSOR": {
        this.cursor = this.stack.pop();
        break;
      }
      case "RST": {
        this.stack = [];
        this.cursor = document.body;
        break;
      }
      case "RST_LOAD_VAR": {
        this.stack = [];
        this.cursor = document.body;
        this.stack.push(this.get(inst.path, context));
        break;
      }
      case "LOAD_VAR": {
        this.stack.push(this.get(inst.path, context));
        break;
      }
      case "STORE_VAR": {
        this.set(inst.path, last(this.stack), context);
        break;
      }
      case "EVAL_EXPR": {
        this.stack.push(eval(inst.value));
        break;
      }
      case "LOAD_CONST": {
        this.stack.push(inst.value);
        break;
      }

      case "DOM_NODE": {
        const node = document.createElement(inst.tag);
        this.stack.push(node);
        this.cursor.append(node);
        break;
      }
      case "SET_PROP": {
        const receiver = last(this.stack);
        const value = inst.path ? this.get(inst.path, context) : inst.literal;
        receiver[inst.name] = value;
        if (receiver instanceof HTMLElement) {
          receiver.style[inst.name] = value;
        }
        break;
      }
      case "BLOCK": {
        const result = this.run(inst.body, context);
        this.stack.push(result);
        break;
      }
      case "BRANCH": {
        const result = last(this.stack);
        if (result) {
          this.run(inst.consequent, context);
        } else {
          this.run(inst.alternate, context);
        }
        break;
      }
      case "DEF_METHOD": {
        const receiver = last(this.stack);
        const thisVM = this;
        const fn = function (argument: any) {
          thisVM.stack.push(argument);
          const result = thisVM.run(inst.body, this);
          thisVM.stack.pop(); // pop the argument
          return result;
        };
        receiver[inst.name] = fn;
        if (receiver instanceof HTMLElement) {
          receiver["on" + inst.name] = fn;
        }
        break;
      }
      case "APPLY_METHOD": {
        const receiver = this.get(inst.receiver, context);
        const argument = this.stack.pop();
        const result = receiver[inst.method](argument);
        this.stack.push(result);
        break;
      }
      case "APPLY_FUNC": {
        const func = window[inst.func];
        const argument = this.stack.pop();
        const result = func(argument);
        this.stack.push(result);
        break;
      }
      case "APPLY_OP": {
        const unary = new Set(["!"]);
        if (unary.has(inst.op)) {
          const right = JSON.stringify(this.stack.pop());
          const result = eval(`${inst.op}${right}`);
          this.stack.push(result);
        } else {
          const right = JSON.stringify(this.stack.pop());
          const left = JSON.stringify(this.stack.pop());
          const result = eval(`${left} ${inst.op} ${right}`);
          this.stack.push(result);
        }
        break;
      }
      default:
        console.log(inst);
    }
    console.groupEnd();
  }

  public run(program: AST[], context?: any) {
    const position = this.stack.length;
    program.forEach((inst) => {
      this.execute(inst, context);
    });
    const result = last(this.stack);
    this.stack.length = position;
    this.cursor = null;
    return result;
  }
}

export function interpret(script: string) {
  parser
    .map((program) => {
      new WenyanVM().run(program);
    })
    .parse(script);
}

window["interpret"] = interpret;
