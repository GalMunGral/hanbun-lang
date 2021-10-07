import { run } from "./VM.js";
import { program } from "./Parser.js";

export function interpret(script: string) {
  program.map(run).parse(script);
}

document
  .querySelectorAll('script[type="text/hanbun"]')
  .forEach((el) => interpret(el.textContent));
