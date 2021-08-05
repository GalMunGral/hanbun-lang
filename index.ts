import { parser } from "./json";

console.log(
  JSON.stringify(
    parser.parse(
      `{ 
        "a": null, 
        "b": [ 
          true, 
          { "e": 123.456 }
        ], 
        "c": {},
        "f": [[["Hello world"]]]
      }`
    ),
    null,
    2
  )
);
