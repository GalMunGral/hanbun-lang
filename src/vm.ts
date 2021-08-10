import { parser } from "./index.js";
import { print, printAll } from "./print.js";
import { AST } from "./types.js";

function last<T>(arr: T[]): T {
  if (arr.length) {
    return arr[arr.length - 1];
  }
  return null;
}

export function interpret(script: string) {
  parser.map((program) => new HBVM().run(program)).parse(script);
}

class HBVM {
  private static root = typeof window != "undefined" ? document.body : null;
  private cursor = HBVM.root;
  private stack: any[] = [];
  private base = 0;

  get(path: string[], context: any) {
    if (path.length == 0) return globalThis;
    const [scope, ...scopedPath] = path;
    const root = scope === "this" ? context : globalThis[scope];
    return scopedPath.reduce((node, name) => node[name], root);
  }

  set(path: string[], value: any, context: any) {
    this.get(path.slice(0, -1), context)[last(path)] = value;
  }

  public run(program: AST[], context?: any) {
    const prevBase = this.base;
    this.base = this.stack.length;
    program.forEach((inst) => {
      this.execute(inst, context);
    });
    const result = last(this.stack);
    // this.stack.length = this.base;
    this.stack = this.stack.slice(0, this.base);
    this.base = prevBase;
    return result;
  }

  private execute(inst: AST, context?: any) {
    console.group(print(inst));
    switch (inst.type) {
      case "SET_CURSOR": {
        this.cursor = this.stack.pop();
        break;
      }
      case "RST": {
        // this.stack.length = this.base;
        this.stack = this.stack.slice(0, this.base);
        this.cursor = HBVM.root;
        break;
      }
      case "RST_VAR": {
        this.stack = [];
        this.cursor = HBVM.root;
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
      case "NODE": {
        const node = document.createElement(inst.tag);
        this.stack.push(node);
        this.cursor.append(node);
        break;
      }
      case "SET": {
        const receiver = last(this.stack);
        const value = inst.path ? this.get(inst.path, context) : inst.literal;
        receiver[inst.name] = value;
        if (typeof window != "undefined" && receiver instanceof HTMLElement) {
          receiver.style[inst.name] = value;
        }
        break;
      }
      case "BLOCK": {
        const result = this.run(inst.body, context);
        this.stack.push(result);
        break;
      }
      case "COND": {
        const test = this.stack.pop();
        const result = this.run(
          test ? inst.consequent : inst.alternate,
          context
        );
        this.stack.push(result);
        break;
      }
      case "HANDLE": {
        const receiver = last(this.stack);
        const thisVM = this;
        const fn = function (argument: any) {
          thisVM.stack.push(argument);
          const result = thisVM.run(inst.body, this);
          thisVM.stack.pop(); // pop the argument
          return result;
        };
        receiver[inst.name] = fn;
        if (typeof window != "undefined" && receiver instanceof HTMLElement) {
          receiver["on" + inst.name] = fn;
        }
        break;
      }
      case "SEND_MSG": {
        const receiver = this.get(inst.receiver, context);
        const argument = this.stack.pop();
        const result = receiver[inst.method](argument);
        this.stack.push(result);
        break;
      }
      case "APPLY_FUNC": {
        const func = globalThis[inst.func];
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
    if (this.stack.length < this.base) {
      throw "STACK IS EMPTY";
    }
    console.debug(...this.stack);
    console.groupEnd();
  }
}

globalThis["interpret"] = interpret;
