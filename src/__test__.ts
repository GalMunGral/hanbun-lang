import { program } from "./parser.js";
import { printAll } from "./print.js";

// program.map(printAll).tap(console.log).parse(`
//   夫「globalThis」。
//   聞「factorial」而曰「
//       是為「數」。有數曰「2」。請「<」之。
//       然。曰「 吾有彼「數」。」
//       不然。曰「
//           吾有彼「數」。
//           有彼「數」。有數曰「1」。請「-」之。
//           請君「factorial」之。請「*」之。
//       」
//   」
// `);

program.map(printAll).tap(console.log).parse(`
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
`);
