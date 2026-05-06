# 漢文 KANBUN

**Live demo:** https://galmungral.github.io/hanbun-lang/

## Rhetorical Design

### Purpose

Programming language syntax is conventionally modeled on English, but this is a historical accident — a computer is indifferent to the natural language a syntax imitates. Keywords such as `for`, `while`, and `return` function as mnemonic aids; the formal semantics of a loop or a stack frame bears no necessary relation to their English meanings. This project makes that decoupling explicit by constructing a programming language whose syntax imitates Classical Chinese instead.

### Strategy

Classical Chinese was chosen for two reasons. First, its grammar is minimal: it is an isolating language with no morphological inflection. Second, its writing system is logographic — each character encodes a morpheme, so every concept is represented by exactly one character. The second property requires a qualification: it holds for Classical Chinese specifically, not for the language in its modern form, which employs multi-character compound words for most concepts. It is, however, precisely this classical form that has full modern input method support, as it shares its character set with Modern Chinese and thereby inherits the CJK input infrastructure built for it.

Classical Chinese does not have nested clauses; the only nesting mechanism is quotation. The language reflects this: instructions are flat and sequential, with no recursive expressions — only recursive control constructs. The result resembles high-level assembly. The language is stack-based: 之, which in Classical Chinese refers to the most recently mentioned subject, maps directly onto the top of the stack. Similarly, 其, meaning "its", maps onto the current scope object. Both are pronouns whose natural referents correspond exactly to runtime concepts. The table below presents each construct alongside its Chinese meaning and its formal definition.

| Construct | Chinese meaning | Formal semantics |
|-----------|-----------------|-----------------|
| `以「x」` | with "x" | push literal "x" |
| `有「x」` | there exists "x" | push literal "x" |
| `取其「x」` | take its "x" | push member "x" of current scope |
| `「op」之` | apply "op" to it | pop two operands, apply "op", push result |
| `謂「x」` | call it "x" | pop and store as "x" in current scope |
| `有此「x」` | there is this "x" | push new element with tag "x" |
| `其「f」也「v」` | its "f" is "v" | set member "f" of top of stack to literal "v" |
| `其「f」者彼「x」` | its "f" is that "x" | set member "f" of top of stack to "x" from current scope |
| `聞「m」則答曰「p」` | upon hearing "m", then answer with "p" | attach handler "p" for message "m" on top of stack |
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

The live demo is driven entirely by a program written in the language itself. The source text of that program is displayed in the background, typeset in the order Classical Chinese is written: right to left, top to bottom.

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