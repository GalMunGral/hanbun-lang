# Hanbun (漢文, 한문, かんぶん)

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

In S-expressions:

```scheme
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

## Hanbun VM Instructions
- Stack: `RESET`, `PUSH (val)`, `PEEK`, `POP`
- Memory: `LOOKUP (path)`, `SAFE_LOOKUP (path)`, `UPDATE (namespace, path, val)`, `UPDATE_ROOT (path, val)`
 
## Hanbun Language Grammar

| Symbol  | Production Rule          |
| ------- | ------------------------ |
| `QUOTE` | `「` `CHAR` `」`         |
| `SCOPE` | `吾` <br> `QUOTE`        |
| `PATH`  | `SCOPE` { `之` `QUOTE` } |
| `RST_VAR` (path)               | `夫` `QUOTE` `。`                                                                |
| `LOAD_VAR` (path)              | [ `吾` ] `有彼` `QUOTE` `。`                                                     |
| `LOAD_CONST` (literal)         | `有數曰` `QUOTE` `。` <br> `有文曰` `QUOTE` `。`                                 |
| `NODE` (type)                  | `有` `QUOTE` `。`                                                                |
| `EVAL_EXPR` (expr)             | `言` `QUOTE` ` 而生一物` `。`                                                    |
| `APPLY_OP` (op)                | `請` `QUOTE` [`之`] `。`                                                         |
| `APPLY_FUNC` (func)            | `請君` `QUOTE` [`之`] `。`                                                       |
| `STORE_VAR` (path)             | `是為` `PATH` `。` <br> `或曰` `PATH` `。`<br> [ `彼` ] `PATH` `當如是` `。`     |
| `SET_CURSOR`                   | `內`                                                                             |
| `SETP_VAR` (name, path)             | `其` `QUOTE` `者` `。` `ws` `彼` `PATH` `也` `。`                                |
| `SETP_VAL` (name, literal)          | `其` `QUOTE` `者` `。` `ws` `QUOTE` `也` `。` <br> [ `其` ] `QUOTE` `QUOTE` `。` |
| `BLOCK` (body)                 | `曰` `「` `INSTRUCTION` { `ws` `INSTRUCTION` } `」`                              |
| `COND` (consequent, alternate) | [ `然` `。` `BLOCK` ] [ `不然` `。` `BLOCK` ]                                    |
| `HANDLE` (name, body)          | `聞` `QUOTE` `而` `BLOCK`                                                        |
| `SEND_MSG` (target, msg)       | `望` [ `彼` ] `PATH` `QUOTE` [`之`] `。` <br> `吾欲` `QUOTE` [`之`] `。`         |

