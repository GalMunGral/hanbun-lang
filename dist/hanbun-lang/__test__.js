import { program } from "./parser.js";
import { printAll } from "./print.js";
program.map(printAll).tap(console.log).parse(`
  夫「globalThis」。
  聞「factorial」而曰「
      是為「數」。有數曰「2」。請「<」之。
      然。曰「 吾有彼「數」。」
      不然。曰「
          吾有彼「數」。
          有彼「數」。有數曰「1」。請「-」之。
          請君「factorial」之。請「*」之。
      」
  」
`);
