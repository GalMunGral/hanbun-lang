import { parser } from "./json";

console.log(parser.parse(`null`));
console.log(parser.parse(`true`));
console.log(parser.parse(`false`));
console.log(parser.parse(`1234.567`));
console.log(parser.parse(`"Hello World"`));
