import { Err } from "./lib.js";
import { interpret } from "./wenyan/vm.js";

const script = `
  咒「Object.create(null)」而得一物。是為「logger」。
  其「alert」者。彼「window」之「alert」也。

  夫「logger」。
    聞「log」而答曰「
      願「console」君「debug」之。吾有彼「text」。
    」
    聞「notify」而答曰「
      是為「text」。吾欲「log」之。
      有文曰「[文言lang-測試]」。有彼「text」。願「+」之。
      願「window」君「alert」之。
    」
  
  有彼「document」之「body」。
    内有「div」。或曰「容器」。
      内有「div」。
        其「padding」「10px」。「display」「flow-root」。
          「background-color」「pink」。「font-weight」「bold」。
        内有「label」。其「textContent」者。「重複次數」也。
        有「input」。或曰「count-input」。其「display」「block」。
        有「button」。或曰「按鍵」。其「textContent」者。「RANDOMIZE」也。
        有「label」。其「textContent」者。「輸入」也。
        有「input」。或曰「文本框」。其「display」「block」。
  
  夫「容器」。
    内有「pre」。或曰「顯示」。
      其「background-color」「lightgray」。「padding」「20px」。
        「white-space」「normal」。「word-break」「break-all」。
  
  夫「按鍵」。
    其「display」「block」。「margin」「10px」。
    聞「click」而答曰「
      有彼「__INITIALIZED__」。
      然。曰「吾欲「randomize」。」
      不然。曰「吾欲「init」。」
    」
    聞「randomize」而答曰「
      咒「Math.random()」而得一物。有彼「count」。請「*」之。
        願「Math」君「floor」之。彼「實際倍數」當如是。
      有文曰「當前重複次數為」。有彼「實際倍數」。請「+」之。
        彼「document」之「title」當如是。
      有彼「倍數」。有文曰「 x 隨機數(0-1) = 」。請「+」之。
        有彼「實際倍數」。請「+」之。願「logger」「notify」之。
      有彼「實際倍數」。願彼「文本框」之「value」「repeat」之。
        彼「顯示」之「textContent」當如是。
    」
    聞「init」而答曰「
      有文曰「應用初始化」。
      願「window」君「confirm」之。 
      然。曰「
        有彼「count-input」之「value」。請「parseInt」之。彼「倍數」當如是。
        咒「isNaN(倍數)」而得一物。 
          然。曰「有數曰「0」。彼「count」當如是。」
        有數曰「1」。彼「__INITIALIZED__」當如是。
          
        夫「count-input」。
          其「randomize」者。吾之「randomize」也。
          聞「blur」而答曰「
            吾欲「randomize」。
            有彼「實際倍數」。願彼「文本框」之「value」「repeat」之。
              彼「顯示」之「textContent」當如是。
          」
          聞「input」而答曰「
            有吾之「value」。請「parseInt」之。彼「count」當如是。
            咒「isNaN(倍數)」而得一物。
            然。曰「有數曰「0」。吾之「value」當如是。彼「count」當如是。」
          」
        夫「文本框」。
          其「background-color」「#ffaaaa」。「color」「white」
          聞「input」而答曰「
            有彼「實際倍數」。願吾之「value」「repeat」之。
            彼「顯示」之「textContent」當如是。
          」
      」
    」
  夫「document」之「body」。
  聞「click」而答曰「
    有彼「__INITIALIZED__」。
    不然。曰「
      有文曰「請輸入您的姓名」。願「window」「prompt」之。是為「name」。
      有文曰「您好」。有彼「name」。願「+」之。
      願「window」「alert」之。
    」
  」
`;

console.log(interpret(script));
console.log(Err.last);
