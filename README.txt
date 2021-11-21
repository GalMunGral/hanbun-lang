Hanbun (漢文, 한문, かんぶん)
 
夫「globalThis」。聞「print」而曰「
  有言曰「HELLO」。
  望「document」之「body」「append」之。
」
    
誦「f => setTimeout(f, 200)」而生一物。是為「延遲」。    
有數曰「0」。是為「預謀」。
夫「document」之「body」。聞「click」而曰「
  吾有彼「預謀」。然。曰「有彼「預謀」。請君「clearTimeout」。」
  有彼「onprint」。請君「延遲」。是為「預謀」。
」

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
          
有數曰「0」。彼「INITIALIZED」當如是。

夫「按鍵」。
  其「display」「block」。
    「margin」「10px」。


  聞「click」而曰「
    夫「INITIALIZED」。不然。
      曰「吾欲「init」之。」
    夫「INITIALIZED」。然。
      曰「吾欲「randomize」之。」
  」

  聞「randomize」而曰「
    夫「數字輸入框」之「value」。
      請君「parseInt」之。是為「globalThis」之「次數」。
      請君「isNaN」之。
        然。曰「有數曰「0」。彼「globalThis」之「「次數」當如是。」
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

      有數曰「1」。彼「globalThis」之「INITIALIZED」當如是。
    」
    不然。曰「有數曰「0」。」
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
