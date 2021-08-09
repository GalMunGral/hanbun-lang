# 漢文 (한문, かんぶん)
HANBUN - Stack-based VM for UI Programming

## I. Instruction Set and Grammar

| SYMBOL | PRODUCTION           |
| ------ | -------------------- |
| QUOTE  | `「` CHAR `」`       |
| SCOPE  | `吾` <br> QUOTE      |
| PATH   | SCOPE { `之` QUOTE } |

| INSTRUCTION                      | PRODUCTION                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------- |
| RST_LOAD_VAR `path`              | `夫` QUOTE `。`                                                               |
| LOAD_VAR `path`                  | [ `吾` ] `有` [ `彼` ] QUOTE `。`                                             |
| LOAD_CONST `literal`             | `有數曰` QUOTE `。` <br> `有文曰` QUOTE `。`                                  |
| DOM_NODE `tag`                   | `有` QUOTE `。`                                                               |
| EVAL_EXPR `expr`                 | `言` QUOTE ` 而生一物` `。`                                                   |
| SET_CURSOR                       | `內`                                                                          |
| STORE_VAR `path`                 | `是為` PATH `。` <br> `或曰` PATH `。`<br> [ `彼` ] PATH 當如是 `。`          |
| SET_PROP `name` `path`           | `其` QUOTE `者` `。` `ws` [ `彼` ] PATH `也` `。`                             |
| SET_PROP `name` `literal`        | `其` QUOTE `者` `。` `ws` `曰` QUOTE `也` `。` <br> [ `其` ] QUOTE QUOTE `。` |
| BLOCK `body`                     | `曰` `「` INSTRUCTION { `ws` INSTRUCTION } `」`                               |
| COND `consequent` `alternate`    | [ `然` `。` BLOCK ] [ `不然` `。` BLOCK ]                                     |
| DEF_METHOD `name` `body`         | `聞` QUOTE `而答` BLOCK                                                       |
| APPLY_METHOD `receiver` `method` | `願` [ `彼` ] PATH QUOTE `之` `。` <br> `吾欲` QUOTE `之` `。`                |
| APPLY_FUNC `func`                | `請君` QUOTE `之` `。`                                                        |
| APPLY_OP `op`                    | `請` QUOTE `之` `。`                                                          |

## II. Sample Code

```
言「Object.create(null)」而生一物。是為「logger」。
其「alert」者。彼「window」之「alert」也。

夫「logger」。
  聞「log」而答曰「
    願「console」「debug」之。吾有彼「消息」。
  」
  聞「notify」而答曰「
    是為「消息」。吾欲「log」之。
    有言曰「[文言lang-測試]」。有彼「消息」。請「+」之。
    願「window」「alert」之。
  」

有彼「document」之「body」。
  内有「div」。或曰「容器」。
    内有「div」。
      其「padding」「10px」。「display」「flow-root」。
        「background-color」「pink」。「font-weight」「bold」。
      内有「label」。
        其「textContent」者。曰「重複次數」也。
      有「input」。或曰「數字輸入框」。其「display」「block」。
      有「button」。或曰「按鍵」。
        其「textContent」者。曰「更新」也。
      有「label」。
        其「textContent」者。曰「輸入」也。
      有「input」。或曰「文本框」。其「display」「block」。

夫「容器」。
  内有「pre」。或曰「顯示框」。
    其「background-color」「lightgray」。「padding」「20px」。
      「white-space」「normal」。「word-break」「break-all」。

夫「按鍵」。
  其「display」「block」。「margin」「10px」。
  聞「click」而答曰「
    有彼「INITIALIZED」。不然。曰「吾欲「init」之。」
    吾欲「randomize」之。
  」
  聞「randomize」而答曰「
    有彼「數字輸入框」之「value」。
      請君「parseInt」之。彼「次數」當如是。
      言「isNaN(次數)」而生一物。
        然。曰「有數曰「0」。彼「次數」當如是。」
    言「Math.random()」而生一物。有彼「次數」。請「*」之。
      願「Math」「floor」之。
      彼「次數」當如是。
    有言曰「當前重複次數為」。
      有彼「次數」。請「+」之。
      彼「document」之「title」當如是。
    有彼「次數」。有言曰「 x 隨機數(0-1) = 」。有彼「次數」。
      請「+」之。請「+」之。
      願「logger」「notify」之。
    有彼「次數」。願「文本框」之「value」「repeat」之。
      彼「顯示框」之「textContent」當如是。
  」
  聞「init」而答曰「
    有言曰「請輸入您的姓名」。願「window」「prompt」之。是為「姓名」。
    然。曰「
      有言曰「您好」。有彼「姓名」。請「+」之。
      願「window」「alert」之。
      夫「文本框」。
        其「background-color」「#ffaaaa」。「color」「white」。
        聞「input」而答曰「
          有彼「次數」。願吾之「value」「repeat」之。
          彼「顯示框」之「textContent」當如是。
        」
      有數曰「1」。彼「INITIALIZED」當如是。
    」
  」
```
