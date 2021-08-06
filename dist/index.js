import { parser } from "./wenyan.js";
const script = `
  有 div 曰 container。
  其 background 「red」 也。其 font-weight 「bold」 也。 
  其中。有 input 曰 mInput。有 button 曰 mButton。
  
  夫 window 之 alert。或曰 test。
  有咒曰「 { } 」。或曰 logger。
  其 alert test 也。

  夫 logger。
  问 「notify」。对曰「
    或曰 myArg。请 console log 之。
    有文曰「通知：」。有 myArg。「+」之。 当 alert 之。
  」

  夫 mInput。
  其 background 「red」 也。
  问「input」。对曰「
    有吾之 value。请 console log 之。
    有咒曰「Math.random() * 10」。请 Math floor 之。请吾之 value repeat 之。
    请 logger notify 之。
  」

  夫 mButton。
  问「click」。对曰「 
    有 mInput 之 value。window 之 title 当如是。吾之 textContent 当如是。
    有文曰「文字长度为：」。有吾之 textContent 之 length。「+」之。
    请 logger notify 之。
  」
`;
console.log(JSON.stringify(parser.parse(script), null, 2));
