import { interpret } from "./wenyan/vm.js";
const script = `
  有咒曰「Object.create(null)」，或曰 logger。
  其 alert 者，window 之 alert 也。

  夫 logger，
  闻「log」，对曰「请 console 君 debug 之。有 text。」
  闻「notify」，对曰「
    或曰 text。吾当 log 之。
    有文曰「[文言lang-测试] 」，有 text「+」之，请 window 君 alert 之。
  」

  有 document 之 body。
    内有 div 曰 container。
      内有无名 div。其 padding 也「10px」，其 display「flow-root」。
      其 background-color「pink」，font-weight「bold」。
        内有无名 label，其 textContent 者「重复次数」也。
        有 input 曰 count-input，其 display 也「block」。
        有无名 label，其 textContent 者「输入」。
        有 input 曰 original-input，display「block」。
        有 button 曰 mButton，其 textContent 者「CLICK ME」。
  
  夫 container，内有 pre 曰 display。
  其 background-color「lightgray」，其 padding 也「20px」。
  其 white-space「normal」，word-break「break-all」。

  夫 mButton，其 display 也「block」，其 margin 也「10px」。
  闻「click」，对曰「
    有 __INITIALIZED__，不然，曰「吾当 init。」
    然后曰「吾当 randomize 之。」
  」

  闻「randomize」，对曰「
    有咒曰「Math.random()」，有 count「*」之。请 Math 君 floor 之，
      real-count 应如是。
    有文曰「当前倍数为 」，有 real-count「+」之，
      document 之 title 应如是。
    有 count，有文曰「x 随机数（0-1）= 」，有 real-count，
      「+」之「+」之，请 logger 君 notify 之。
    有 real-count，original-input 之 value 当 repeat 之，
      display 之 textContent 应如是。
  」
  
  闻「init」，对曰「
    有文曰「确认：初始化应用」，请 window 君 confirm 之，然后曰「
      有 count-input 之 value，parseInt 之，count 应如是。
      有咒曰「isNaN(count)」，然后曰「有0，count 应如是。」
      有咒曰「true」，__INITIALIZED__ 应如是。

      夫 count-input。
      其 randomize 者，吾之 randomize 也。
      闻「blur」，对曰「
        吾当 randomize 之。
        有 real-count，请 original-input 之 value repeat 之。
        display 之 textContent 应如是。
      」
      闻「input」，对曰「
        有吾之 value，parseInt 之，count 应如是。
        有咒曰「isNaN(count)」，然后曰「
          有0，吾之 value 应如是，count 应如是。
        」
      」
      
      夫 original-input，
      其 background-color 也「#ffaaaa」，其 color 也「white」。
      闻「input」，对曰「
        有 real-count，吾之 value 当 repeat 之。
        display 之 textContent 应如是。
      」
    」
  」
`;
console.log(interpret(script));
