import { RUN } from "./Interpreter.js";
import { program } from "./Parser.js";

export function interpret(script: string) {
  program.map(RUN).parse(script);
}

document
  .querySelectorAll('script[type="text/hanbun"]')
  .forEach((el) => interpret(el.textContent));
