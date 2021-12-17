Hanbun (漢文, 한문, かんぶん)

有數「0」彼「window」之「顏色」當如是
有數「-1」彼「window」之「前者」當如是

夫「window」

聞「損」而曰「
  有數『0』望『Math』『random』之『*』之
」

聞「mousemove」而曰「
  有『0』望『Date』『now』之 是為『今』
  有『今』有彼『window』之『前者』『-』之 有數『100』『>』之
  然 曰『
    夫「今」彼『window』之「前者」當如是
    吾欲「生成」之
  』
」

聞「生成」而曰「
  是為『事件』
  有『事件』之『clientX』然 曰『
    有「事件」之「clientY」然 曰「

      有此『碎片』

      聞『消滅』而曰『
        望吾之「相」「remove」之
      』

      聞『顯現』而曰『
        有言曰「#frag」望「document」「querySelector」之
          是為「原型」
        有數「1」望「原型」之「content」「cloneNode」之
          是為「複本」
        夫「複本」之「children」之「0」
          吾之「相」當如是
        有言曰「hsl(」有彼「顏色」有言曰「, 50%, 50%)」「+」之「+」之
          吾之「相」之「children」之「0」之「style」之「fill」當如是
        有「window」之「顏色」有數「1」「+」之
          彼「window」之「顏色」當如是
        夫吾之「相」望「document」之「body」「append」之
      』

      聞『移動』而曰『
        有吾之「壽」有數「80」「>=」之
        然 曰「有數『0』吾欲『消滅』之」
        不然 曰「
          有吾之『橫距』有彼『window』之『innerWidth』『>』之
          然 曰『有數『0』吾欲「消滅」之』
          不然 曰『
            有吾之「縱距」有彼「window」之「innerHeight」「>」之
            然 曰「有數『0』吾欲『消滅』之」
            不然 曰「
              有吾之『壽』有數『1』『+』之 吾之『壽』當如是

              夫吾之『橫距』
                有吾之『縱距』有吾之『初縱距』『-』之 有吾之『橫速』『+』之
                有數『2』『**』之 有數『5000』『/』之
                有數『1』請君『損』之『*』之
              『+』之 吾之『橫距』當如是

              夫吾之『縱距』
                有吾之『縱距』有吾之『初縱距』『-』之 有吾之『縱速』『+』之
                有數『10』『/』之
                有數『1』請君『損』之『*』之
              『+』之 吾之『縱距』當如是

              有吾之『旋轉』有數『10』『+』之
              吾之『旋轉』當如是

              有吾之『伸縮』有數『0.1』『+』之
              吾之『伸縮』當如是

              有言曰『translate3d(』有吾之『橫距』『+』之
              有言曰『px, 』有吾之『縱距』『+』之『+』之
              有言曰『px, 0) rotate3d(』有吾之『軸一』『+』之『+』之
              有言曰『, 』有吾之『軸二』『+』之『+』之
              有言曰『, 』有吾之『軸三』『+』之『+』之
              有言曰『, 』有吾之『旋轉』有言曰『deg)』『+』之『+』之『+』之
              有言曰『 scale(』有吾之『伸縮』有言曰『)』『+』之『+』之『+』之

              吾之『相』之『style』之『transform』當如是
              有吾之『移動』請君『requestAnimationFrame』之
            」
          』
        」
      』

      是為『物』

      有彼『事件』之『clientX』
      有數『1』請君『損』之
      有數『0.5』『-』之
      有數『2』『*』之
      『+』之
      彼『物』之『橫距』當如是

      有彼『事件』之『clientY』
      有數『1』請君『損』之
      有數『0.5』『-』之 有數『3』『*』之『+』之
      彼『物』之『縱距』當如是
      有彼『物』之『縱距』彼『物』之『初縱距』當如是

      有數『100』有數『1』請君『損』之『*』之
      彼『物』之『橫速』當如是
      
      有數『10』彼『物』之『縱速』當如是

      有數『1』請君『損』之 彼『物』之『軸一』當如是
      有數『1』請君『損』之 彼『物』之『軸二』當如是
      有數『1』請君『損』之 彼『物』之『軸三』當如是

      有數『0』 彼『物』之『壽』當如是
      有數『1』 彼『物』之『伸縮』當如是
      有數『360』請君『損』之 彼『物』之『旋轉』當如是

      望彼『物』『顯現』之
      有彼『物』之『移動』請君『requestAnimationFrame』之
    」
  』
」

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
