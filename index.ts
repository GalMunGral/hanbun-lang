import { parser } from "./json";

console.log(
  JSON.stringify(
    parser.parse(
      `[ [ null, [true], false ], [[1234.567]], [[["Hello World"]]] ]`
    ),
    null,
    2
  )
);
