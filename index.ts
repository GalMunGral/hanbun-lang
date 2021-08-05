import { parser } from "./json";

console.log(
  JSON.stringify(
    parser.parse(
      `{ 
        "a": null, 
        "b": { 
          "c": true, 
          "d": { 
            "e": 123.456 
          } 
        }, 
        "f": "Hello world"
      }`
    ),
    null,
    2
  )
);
