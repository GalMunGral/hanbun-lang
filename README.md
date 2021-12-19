# 漢文 HANBUN

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

## Example

```
夫「window」
聞「階乘」則答曰「
  是謂『數』
  取其『數』以『2』『<』之
  然『 取其「數」』
  不然『
    取其「數」以「1」「-」之
    吾當「階乘」之
    取其「數」「*」之
  』
」
```
