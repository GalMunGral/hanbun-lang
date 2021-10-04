import { RUN } from "./Runtime.js";
import { program } from "./Parser.js";

export function interpret(script: string) {
  program.map(RUN([], window)).parse(script);
}
