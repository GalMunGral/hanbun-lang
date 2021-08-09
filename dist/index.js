import { Err } from "./lib.js";
import { interpret } from "./wenyan/vm.js";
const script = `
  唸「Object.create(null)」而得一物。是為「logger」。
  其「alert」者。彼「window」之「alert」也。

  夫「logger」。
    聞「log」而答曰「
      願「console」「debug」之。吾有彼「text」。
    」
    聞「notify」而答曰「
      是為「text」。吾欲「log」之。
      有文曰「[文言lang-測試]」。有彼「text」。請「+」之。
      願「window」「alert」之。
    」
  
  有彼「document」之「body」。
    内有「div」。或曰「容器」。
      内有「div」。
        其「padding」「10px」。「display」「flow-root」。
          「background-color」「pink」。「font-weight」「bold」。
        内有「label」。其「textContent」曰「重複次數」也。
        有「input」。或曰「數字輸入框」。其「display」「block」。
        有「button」。或曰「按鍵」。其「textContent」曰「更新」也。
        有「label」。其「textContent」曰「輸入」也。
        有「input」。或曰「文本框」。其「display」「block」。
  
  夫「容器」。
    内有「pre」。或曰「顯示」。
      其「background-color」「lightgray」。「padding」「20px」。
        「white-space」「normal」。「word-break」「break-all」。
  
  夫「按鍵」。
    其「display」「block」。「margin」「10px」。
    聞「click」而答曰「
      有彼「__INITIALIZED__」。不然。曰「吾欲「init」之。」
      吾欲「randomize」之。
    」
    聞「randomize」而答曰「
      有彼「數字輸入框」之「value」。
        請君「parseInt」之。彼「次數」當如是。
        唸「isNaN(次數)」而得一物。
          然。曰「有數曰「0」。彼「次數」當如是。」
      唸「Math.random()」而得一物。有彼「次數」。請「*」之。
        願「Math」「floor」之。彼「次數」當如是。
      有文曰「當前重複次數為」。有彼「次數」。請「+」之。
        彼「document」之「title」當如是。
      有彼「次數」。有文曰「 x 隨機數(0-1) = 」。請「+」之。
        有彼「次數」。請「+」之。願「logger」「notify」之。
      有彼「次數」。願「文本框」之「value」「repeat」之。
        彼「顯示」之「textContent」當如是。
    」
    聞「init」而答曰「
      有文曰「請輸入您的姓名」。願「window」「prompt」之。是為「name」。
      然。曰「
        有文曰「您好」。有彼「name」。請「+」之。
        願「window」「alert」之。
        夫「文本框」。
          其「background-color」「#ffaaaa」。「color」「white」。
          聞「input」而答曰「
            有彼「次數」。願吾之「value」「repeat」之。
            彼「顯示」之「textContent」當如是。
          」
        有數曰「1」。彼「__INITIALIZED__」當如是。
      」
    」
`;
console.log(interpret(script));
console.log(Err.last);
