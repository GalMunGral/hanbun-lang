Hanbun (漢文, 한문, かんぶん)

<quote> ::= 「{<char>}」
<root> ::= 吾 | <quote>
<path>  ::= <root>{之<quote>}
<load-val> ::= 以<quote> | 有<quote> | 有言<quote>
<load-var> ::= 取[其]<quote> | 取[彼]<quote> | 夫[彼]<quote>
<operate> ::= <quote>之
<store-var> ::= [是]謂<path> | 今<path>如是 | 今<path>亦然
<block> ::=  曰「<stmt>{<ws><stmt>}」
<cond> ::= 然<block>[不然<block>] | 不然<block>
<node> ::= 有此<quote>
<set-mem-val> ::= 其<quote>也<quote>也 | 其<quote><quote>
<set-mem-var> ::= 其<quote>者彼<path>也
<msg-def> ::= 聞<quote>則答曰<block>
<msg-send> ::= 願[彼]<path><quote>[之] | 彼<path>其<quote>者何 |
               吾欲<quote>[之] | 吾當<quote>[之] | 請<quote>[之]

# Example 1: Factorial

夫「window」
聞「階乘」則答曰「
  是謂『數』
  取其『數』以『2』『<』之 
  然『 取其「數」』
  不然『
    取其「數」以「1」「-」之
    請「階乘」之
    取其「數」「*」之
  』
」
有「20」請「階乘」之
願「console」「log」之

# Example 2: Animation

有「0」謂「window」之「顏色」
有「0」謂「window」之「昔」

夫「window」
聞「mousemove」則答曰「
  有『0』彼『Date』其『now』者何 是謂『今』
  取其『今』取『window』之『昔』『-』之
  以『50』『>』之 然『
    取其「今」今「window」之「昔」亦然
    吾欲「生」之
  』
」
聞「生」則答曰「
  是謂『變』
  取『變』之『clientX』然『
    取「變」之「clientY」然「
      有此『fragment』
      聞『滅』則答曰『
        願吾之「相」「remove」之
      』
      聞『顯』則答曰『
        有言「#frag」願「document」「querySelector」之 
          是謂「原型」
        有「1」願「原型」之「content」「cloneNode」之 
          是謂「複本」
        夫「複本」之「children」之「0」
          謂吾之「相」
        有言「hsl(」取其「顏色」有言「, 50%, 50%)」「+」之「+」之
          今吾之「相」之「children」之「0」之「style」之「fill」如是
        取彼「window」之「顏色」以「1」「+」之
          今「window」之「顏色」如是
        取吾之「相」
          願「document」之「body」「append」之
      』
      聞『動』則答曰『
        取吾之「壽」以「100」「>」之
        然「吾當『滅』」
        不然「
          取吾之『經』取『window』之『innerWidth』『>』之
          然『吾當「滅」』
          不然『
            取吾之「緯」取「window」之「innerHeight」「>」之
            然「吾當『滅』」
            不然「
              取吾之『壽』以『1』『+』之
                今吾之『壽』如是
              取吾之『經』
                取吾之『緯』
                取吾之『緯始』『-』之
                取吾之『經變』『+』之
                以『2』『**』之
                以『5000』『/』之
                有『0』彼『Math』其『random』者何
                『*』之『+』之 
                今吾之『經』如是
              取吾之『緯』
                取吾之『緯』
                取吾之『緯始』『-』之
                取吾之『緯變』『+』之
                以『10』『/』之
                有『0』彼『Math』其『random』者何
                『*』之『+』之
                今吾之『緯』如是
              取吾之『旋』以『10』『+』之
                今吾之『旋』如是
              取吾之『展』以『0.1』『+』之
                今吾之『展』如是
              有言『translate3d(』取吾之『經』『+』之
                有言『px, 』取吾之『緯』『+』之『+』之
                有言『px, 0) rotate3d(』取吾之『軸一』『+』之『+』之
                有言『, 』取吾之『軸二』『+』之『+』之
                有言『, 』取吾之『軸三』『+』之『+』之
                有言『, 』取吾之『旋』『+』之『+』之
                有言『deg) scale(』取吾之『展』『+』之『+』之
                有言『)』『+』之
                今吾之『相』之『style』之『transform』如是
              取吾之『動』請『requestAnimationFrame』之
            」
          』
        」
      』
      是謂『物』

      有『0』
        謂『物』之『壽』 
      有『1』
        謂『物』之『展』

      取其『變』之『clientX』
        有『0』彼『Math』其『random』者何
        以『0.5』『-』之
        以『2』『*』之『+』之
        謂『物』之『經』
      取其『變』之『clientY』
        有『0』彼『Math』其『random』者何
        以『0.5』『-』之
        以『3』『*』之『+』之
        謂『物』之『緯』
      夫彼『物』之『緯』
        今『物』之『緯始』亦然

      有『0』彼『Math』其『random』者何
        以『100』『*』之
        謂『物』之『經變』
      有『10』
        謂『物』之『緯變』

      有『0』彼『Math』其『random』者何
        以『360』『*』之
        謂『物』之『旋』
      有『0』彼『Math』其『random』者何
        謂『物』之『軸一』
      有『0』彼『Math』其『random』者何
        謂『物』之『軸二』
      有『0』彼『Math』其『random』者何
        謂『物』之『軸三』

      願彼『物』『顯』之
      取『物』之『動』請『requestAnimationFrame』之
    」
  』
」
