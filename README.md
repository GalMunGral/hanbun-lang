# 漢文 HANBUN

**Live demo:** https://galmungral.github.io/hanbun-lang/

## Rhetorical Design

### Purpose

Programming language syntax is conventionally modeled on English, but this is a historical accident — a computer is indifferent to the natural language a syntax imitates. Keywords such as `for`, `while`, and `return` function as mnemonic aids; the formal semantics of a loop or a stack frame bears no necessary relation to their English meanings. This project makes that decoupling explicit by constructing a programming language whose syntax imitates Classical Chinese instead.

### Strategy

Classical Chinese was chosen for two reasons. Its grammar is minimal — it is an isolating language with no morphological inflection. Its writing system is logographic: each character encodes a morpheme, so every concept is expressed as exactly one character, without exception. Modern Chinese does not have this guarantee, as most concepts require multi-character compound words; Classical Chinese does, because it was designed to be read rather than spoken.

The language is stack-based, a consequence of the central role of 之. In Classical Chinese, 之 is a pronoun meaning "it" — referring to the most recently mentioned subject. The top of the stack is precisely the most recently produced value, so the stack model follows directly from the pronoun's semantics. The translation table presents each construct alongside its Chinese meaning and its formal definition, keeping both layers visible.

| Construct | Chinese meaning | Formal semantics |
|-----------|-----------------|-----------------|
| `以「x」` | with "x" | push literal "x" |
| `有「x」` | there exists "x" | push literal "x" |
| `取其「x」` | take its "x" | push variable "x" |
| `「op」之` | apply "op" to it | pop two operands, apply "op", push result |
| `謂「x」` | call it "x" | pop and assign to "x" |
| `有此「x」` | there is this "x" | create object, bind to "x" |
| `其「f」也「v」` | its "f" is "v" | set member "f" to literal "v" |
| `其「f」者彼「x」` | its "f" is that "x" | set member "f" to variable "x" |
| `聞「m」則答曰「p」` | upon hearing "m", then answer with "p" | define handler for message "m" with body "p" |
| `願彼「x」「m」` | request that "x" does "m" | send message "m" to "x" |
| `然「p」不然「q」` | if so "p", if not so "q" | if condition then "p" else "q" |

The following example defines a factorial function. Each line is annotated with its natural language reading:

```
夫「window」                        — take that "window"
聞「階乘」則答曰「                  — upon hearing "factorial", answer with:
  是謂『數』                        —   call it "number"
  取其『數』以『2』『<』之          —   take its "number", with "2", apply "<" to it
  然『 取其「數」』                 —   if so: take its "number"
  不然『                            —   if not so:
    取其「數」以「1」「-」之        —     take its "number", with "1", apply "-" to it
    吾當「階乘」之                  —     I shall do "factorial" to it
    取其「數」「*」之               —     take its "number", apply "*" to it
  』
」
```

The implementation is written in PureScript using parser combinators. The runtime is in JavaScript: objects are plain JS objects or DOM elements, and message sending is property lookup followed by a function call.

```
<quote> ::= 「{<char>}」
<root> ::= 吾 | <quote>
<path> ::= <root>{之<quote>}
<load-val> ::= 以<quote> | 有<quote> | 有言<quote>
<load-var> ::= 取[其]<quote> | 取[彼]<quote> | 夫[彼]<quote>
<operate> ::= <quote>之
<store-var> ::= [是]謂<path> | 今<path>如是 | 今<path>亦然
<block> ::= 曰「<stmt>{<ws><stmt>}」
<cond> ::= 然<block>[不然<block>] | 不然<block>
<node> ::= 有此<quote>
<set-mem-val> ::= 其<quote>[也]<quote>
<set-mem-var> ::= 其<quote>者彼<path>也
<msg-def> ::= 聞<quote>則答曰<block>
<msg-send> ::= 願[彼]<path><quote>[之] | 彼<path>其<quote>者何 |
               吾欲<quote>[之] | 吾當<quote>[之] | 請<quote>[之]
```