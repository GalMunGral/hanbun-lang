Hanbun (漢文, 한문, かんぶん)
 
## Grammar

<quote> ::= 「{<char>}」
<scope> ::= 吾 | <quote>
<path>  ::= <scope>{之<quote>}
<block> ::=  曰「<stmt>{<ws><stmt>}」
<cond> ::= 然。<block>[不然。<block>] | 不然。<block>
<handle-msg> ::= 聞<quote>而<block>
<send-msg> ::= 望[彼]<path><quote>[之]。 | 吾欲<quote>[之]。
<rst-var>  ::= 夫<quote>。
<load-var> ::= [吾]有彼<quote>。
<load-const> ::= 有數曰<quote>。 | 有文曰<quote>。
<node-decl> ::= 有<quote>。
<eval-expr> ::= 誦<quote>而生一物。
<apply-op> ::= 請<quote>[之]。
<apply-func> ::= 請君<quote>[之]。
<store-var> ::= 是為<path>。 | 或曰<path>。 | [彼]<path>當如是。
<setp_var> ::= 其<quote>者。<ws>彼<path>也。
<setp_val> ::= 其<quote>者。<ws><quote>也。 | [其]<quote><quote>。
<set-cursor> ::= 內

## Example

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

in S-expressions:

(rst-var 'globalThis)
(handle-msg 'factorial
  ((store-var ('數))
    (load-const 2)
    (apply-op <)
    (cond
      ((load-var ('數)))
      ((load-var ('數))
        (load-var ('數))
        (load-const 1)
        (apply-op -)
        (apply-func 'factorial)
        (apply-op *))))
