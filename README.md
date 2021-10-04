# Hanbun (漢文, 한문, かんぶん)

An object-oriented, stack-based VM for UI Programming.

```
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
```

The code above is equivalent to:

```lisp
(RST_VAR "globalThis")
(HANDLE "factorial"
  ((STORE_VAR ("數"))
    (LOAD_CONST 2)
    (APPLY_OP "<")
    (COND
      ((LOAD_VAR ("數")))
      ((LOAD_VAR ("數"))
        (LOAD_VAR ("數"))
        (LOAD_CONST 1)
        (APPLY_OP "-")
        (APPLY_FUNC "factorial")
        (APPLY_OP "*"))))
```

## I. Instruction Set and Grammar

| SYMBOL  | PRODUCTION RULE          |
| ------- | ------------------------ |
| `QUOTE` | `「` `CHAR` `」`         |
| `SCOPE` | `吾` <br> `QUOTE`        |
| `PATH`  | `SCOPE` { `之` `QUOTE` } |

| INSTRUCTION / SYMBOL           | PRODUCTION RULE                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------- |
| `RST_VAR` (path)               | `夫` `QUOTE` `。`                                                                |
| `LOAD_VAR` (path)              | [ `吾` ] `有彼` `QUOTE` `。`                                                     |
| `LOAD_CONST` (literal)         | `有數曰` `QUOTE` `。` <br> `有文曰` `QUOTE` `。`                                 |
| `NODE` (type)                  | `有` `QUOTE` `。`                                                                |
| `EVAL_EXPR` (expr)             | `言` `QUOTE` ` 而生一物` `。`                                                    |
| `APPLY_OP` (op)                | `請` `QUOTE` [`之`] `。`                                                         |
| `APPLY_FUNC` (func)            | `請君` `QUOTE` [`之`] `。`                                                       |
| `STORE_VAR` (path)             | `是為` `PATH` `。` <br> `或曰` `PATH` `。`<br> [ `彼` ] `PATH` `當如是` `。`     |
| `SET_CURSOR`                   | `內`                                                                             |
| `SET` (name, path)             | `其` `QUOTE` `者` `。` `ws` `彼` `PATH` `也` `。`                                |
| `SET` (name, literal)          | `其` `QUOTE` `者` `。` `ws` `QUOTE` `也` `。` <br> [ `其` ] `QUOTE` `QUOTE` `。` |
| `BLOCK` (body)                 | `曰` `「` `INSTRUCTION` { `ws` `INSTRUCTION` } `」`                              |
| `COND` (consequent, alternate) | [ `然` `。` `BLOCK` ] [ `不然` `。` `BLOCK` ]                                    |
| `HANDLE` (name, body)          | `聞` `QUOTE` `而` `BLOCK`                                                        |
| `SEND_MSG` (target, msg)       | `望` [ `彼` ] `PATH` `QUOTE` [`之`] `。` <br> `吾欲` `QUOTE` [`之`] `。`         |

## II. A More Elaborate Example

```
誦「Object.create(null)」而生一物。是為「logger」。
其「alert」者。彼「window」之「alert」也。

夫「logger」。
    聞「log」而曰「
        望「console」「debug」之。吾有彼「紀錄」。
    」
    聞「notify」而曰「
        是為「紀錄」。吾欲「log」之。
        有言曰「[文言lang-測試]」。有彼「紀錄」。請「+」之。
        望「window」「alert」之。
    」

夫「document」之「body」。
    内有「div」。或曰「容器」。
    内有「div」。
        其「padding」「10px」。
            「display」「flow-root」。
            「background-color」「pink」。
            「font-weight」「bold」。
        内有「label」。
            其「textContent」者。「重複次數」也。
        有「input」。或曰「數字輸入框」。
            其「display」「block」。
        有「button」。或曰「按鍵」。
            其「textContent」者。「更新」也。
        有「label」。
            其「textContent」者。「輸入」也。
        有「input」。或曰「文本框」。
            其「display」「block」。

夫「容器」。
    内有「pre」。或曰「顯示框」。
        其「background-color」「lightgray」。
            「padding」「20px」。
            「white-space」「normal」。
            「word-break」「break-all」。

夫「按鍵」。
    其「display」「block」。
        「margin」「10px」。

    聞「click」而曰「
        夫「INITIALIZED」。不然。
            曰「吾欲「init」之。」
        夫「INITIALIZED」。然。
            曰「吾欲「randomize」之。」
    」

    聞「init」而曰「
        有言曰「請輸入您的姓名」。望「window」「prompt」之。是為「姓名」。
        然。曰「
            有言曰「您好」。有彼「姓名」。請「+」之。
            望「window」「alert」之。

            夫「文本框」。
                其「background-color」「#ffaaaa」。
                    「color」「white」。

                聞「input」而曰「
                    夫「次數」。望吾之「value」「repeat」之。
                    彼「顯示框」之「textContent」當如是。
                」

            有數曰「1」。彼「INITIALIZED」當如是。
        」
        不然。曰「有數曰「0」。」
    」

    聞「randomize」而曰「
        夫「數字輸入框」之「value」。
            請君「parseInt」之。是為「次數」。
            請君「isNaN」之。
                然。曰「有數曰「0」。彼「次數」當如是。」

        夫「次數」。彼「原次數」當如是。
            誦「Math.random()」而生一物。請「*」之。
            望「Math」「floor」之。
            彼「次數」當如是。

        有言曰「當前重複次數為 」。
            有彼「次數」。請「+」之。
            彼「document」之「title」當如是。

        有彼「原次數」。有言曰「 x 隨機數(0-1) = 」。有彼「次數」。
            請「+」之。請「+」之。
            望「logger」「notify」之。

        夫「次數」。
            望「文本框」之「value」「repeat」之。
            彼「顯示框」之「textContent」當如是。
    」
```

or, equivalently

```lisp
(EVAL_EXPR "Object.create(null)")
(STORE_VAR ("logger"))
(SETP_VAR "alert" ("window" "alert"))

(RST_VAR "logger")

(HANDLE "log"
  ((SEND_MSG ("console") "debug")
    (LOAD_VAR ("紀錄"))))

(HANDLE "notify"
  ((STORE_VAR ("紀錄"))
    (SEND_MSG "this" "log")
    (LOAD_CONST "[文言lang-測試]")
    (LOAD_VAR ("紀錄"))
    (APPLY_OP "+")
    (SEND_MSG ("window") "alert")))

(RST_VAR ("document" "body"))
(SET_CURSOR)

(NODE "div")
(STORE_VAR ("容器"))
(SET_CURSOR)

(NODE "div")
(SETP_VAL "padding" "10px")
(SETP_VAL "display" "flow-root")
(SETP_VAL "background-color" "pink")
(SETP_VAL "font-weight" "bold")
(SET_CURSOR)

(NODE "label")
(SETP_VAL "textContent" "重複次數")

(NODE "input")
(STORE_VAR ("數字輸入框"))
(SETP_VAL "display" "block")

(NODE "button")
(STORE_VAR ("按鍵"))
(SETP_VAL "textContent" "更新")

(NODE "label")
(SETP_VAL "textContent" "輸入")

(NODE "input")
(STORE_VAR ("文本框")
(SETP_VAL "display" "block")

(RST_VAR ("容器"))
(SET_CURSOR)

(NODE "pre")
(STORE_VAR ("顯示框"))
(SETP_VAL "background-color" "lightgray")
(SETP_VAL "padding" "20px")
(SETP_VAL "white-space" "normal")
(SETP_VAL "word-break" "break-all")

(RST_VAR ("按鍵"))
(SETP_VAL "display" "block")
(SETP_VAL "margin" "10px")

(HANDLE "click"
  ((RST_VAR ("INITIALIZED"))
    (COND () ((SEND_MSG ("this") "init")))
    (RST_VAR ("INITIALIZED"))
    (COND ((SEND_MSG ("this") "randomize")) ())))

(HANDLE "init"
  ((LOAD_CONST "請輸入您的姓名")
    (SEND_MSG ("window") "prompt")
    (STORE_VAR ("姓名"))
    (COND
      ((LOAD_CONST "您好")
        (LOAD_VAR ("姓名"))
        (APPLY_OP "+")
        (SEND_MSG ("window") "alert")

        (RST_VAR ("文本框"))
        (SETP_VAL "background-color" "#ffaaaa")
        (SETP_VAL "color" "white")

        (HANDLE "input"
          ((RST_VAR ("次數"))
            (SEND_MSG ("this" "value") "repeat")
            (STORE_VAR ("顯示框" "textContent"))))

        (LOAD_CONST 1)
        (STORE_VAR ("INITIALIZED")))
      ((LOAD_CONST 0)))))

(HANDLE "randomize"
  ((RST_VAR ("數字輸入框" "value"))
    (APPLY_FUNC "parseInt")
    (STORE_VAR ("次數"))
    (APPLY_FUNC "isNaN")
    (COND
      ((LOAD_CONST 0)
        (STORE_VAR ("次數")))
      ())
    (RST_VAR ("次數"))
    (STORE_VAR ("原次數"))
    (EVAL_EXPR "Math.random()")
    (APPLY_OP "*")
    (SEND_MSG ("Math") "floor")
    (STORE_VAR ("次數"))
    (LOAD_CONST "當前重複次數為")
    (LOAD_VAR ("次數"))
    (APPLY_OP "+")
    (STORE_VAR ("document" "title"))
    (LOAD_VAR "原次數")
    (LOAD_CONST " x 隨機數(0-1) =")
    (LOAD_VAR ("次數"))
    (APPLY_OP "+")
    (APPLY_OP "+")
    (SEND_MSG ("logger") "notify")
    (RST_VAR ("次數"))
    (SEND_MSG ("文本框" "value") "repeat")
    (STORE_VAR ("顯示框" "textContent"))))
```
