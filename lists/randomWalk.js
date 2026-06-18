"use strict";

/**
 * There is probably a better way to do this, so I'm open to ideas. This is
 * mostly readable, so it works.
 * 
 * Each layout is a dictionary of literal keys, where each key defines a list of
 * left, right, down, up, and shifted variants. The logic is commented as such
 * to help with readability.
 * 
 * Currently just sticking with the most common keyboard layouts: Colemak,
 * Dvorak, Norman, Qwerty, and Workman. I know there are tons of others, but
 * they're all very obscure. If you type in a different layout, you're reading
 * this, and you feel very strongly about including your layout, send me a pull
 * request.
 *
 * See https://getreuer.info/posts/keyboards/alt-layouts/index.html
 */

const layouts = {};

layouts.COLEMAK = {
      // ["l", "L", "r", "R", "d", "D", "u", "U"] top row
    "`": [          "1", "!"                    ], get "~"() { return this["`"]; },
    "1": ["`", "~", "2", "@", "q", "Q"          ], get "!"() { return this["1"]; },
    "2": ["1", "!", "3", "#", "w", "W"          ], get "@"() { return this["2"]; },
    "3": ["2", "@", "4", "$", "f", "F"          ], get "#"() { return this["3"]; },
    "4": ["3", "#", "5", "%", "p", "P"          ], get "$"() { return this["4"]; },
    "5": ["4", "$", "6", "^", "g", "G"          ], get "%"() { return this["5"]; },
    "6": ["5", "%", "7", "&", "j", "J"          ], get "^"() { return this["6"]; },
    "7": ["6", "^", "8", "*", "l", "L"          ], get "&"() { return this["7"]; },
    "8": ["7", "&", "9", "(", "u", "U"          ], get "*"() { return this["8"]; },
    "9": ["8", "*", "0", ")", "y", "Y"          ], get "("() { return this["9"]; },
    "0": ["9", "(", "[", "{", ";", ":"          ], get ")"() { return this["0"]; },
    "-": ["0", ")", "=", "+", "[", "{"          ], get "_"() { return this["-"]; },
    "=": [          "-", "_", "]", "}"          ], get "+"() { return this["="]; },
      //  ["l", "L", "r",  "R", "d", "D", "u", "U"] second row
    "q":  [          "w",  "W", "a", "A", "1", "!"], get "Q"() { return this["q"]; },
    "w":  ["q", "Q", "f",  "F", "r", "R", "2", "@"], get "W"() { return this["w"]; },
    "f":  ["w", "W", "p",  "P", "s", "S", "3", "#"], get "F"() { return this["f"]; },
    "p":  ["f", "F", "g",  "G", "t", "T", "4", "$"], get "P"() { return this["p"]; },
    "g":  ["p", "P", "j",  "J", "d", "D", "5", "%"], get "G"() { return this["g"]; },
    "j":  ["g", "G", "l",  "L", "h", "H", "6", "^"], get "J"() { return this["j"]; },
    "l":  ["j", "J", "u",  "U", "n", "N", "7", "&"], get "L"() { return this["l"]; },
    "u":  ["l", "L", "y",  "Y", "e", "E", "8", "*"], get "U"() { return this["u"]; },
    "y":  ["u", "U", ";",  ";", "i", "I", "9", "("], get "Y"() { return this["y"]; },
    ";":  ["y", "Y", "[",  "[", "o", "O", "0", ")"], get ":"() { return this[";"]; },
    "[":  [";", ":", "]",  "]", "[", "{", "'", '"'], get "{"() { return this["["]; },
    "]":  ["[", "{", "\\", "|",           "=", "+"], get "}"() { return this["]"]; },
    "\\": ["]", "}"                               ], get "|"() { return this["\\"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] third row
    "a": [          "r", "R", "z", "Z", "q", "Q"], get "A"() { return this["a"]; },
    "r": ["a", "A", "s", "S", "x", "X", "w", "W"], get "R"() { return this["r"]; },
    "s": ["r", "R", "t", "T", "c", "C", "f", "F"], get "S"() { return this["s"]; },
    "t": ["s", "S", "d", "D", "v", "V", "p", "P"], get "T"() { return this["t"]; },
    "d": ["t", "T", "h", "H", "b", "B", "g", "G"], get "D"() { return this["d"]; },
    "h": ["d", "D", "n", "N", "k", "K", "j", "J"], get "H"() { return this["h"]; },
    "n": ["h", "H", "e", "E", "m", "M", "l", "L"], get "N"() { return this["n"]; },
    "e": ["n", "N", "i", "I", ",", "<", "u", "U"], get "E"() { return this["e"]; },
    "i": ["e", "E", "o", "O", ".", ">", "y", "Y"], get "I"() { return this["i"]; },
    "o": ["i", "I", "'", '"', "/", "?", ";", ":"], get "O"() { return this["o"]; },
    "'": ["o", "O",                     "[", "{"], get '"'() { return this["'"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] fourth row
    "z": [          "x", "X",           "a", "A"], get "Z"() { return this["z"]; },
    "x": ["z", "Z", "c", "C",           "r", "R"], get "X"() { return this["x"]; },
    "c": ["x", "X", "v", "V",           "s", "S"], get "C"() { return this["c"]; },
    "v": ["c", "C", "b", "B",           "t", "T"], get "V"() { return this["v"]; },
    "b": ["v", "V", "k", "K",           "d", "D"], get "B"() { return this["b"]; },
    "k": ["b", "B", "m", "M",           "h", "H"], get "K"() { return this["k"]; },
    "m": ["k", "K", ",", "<",           "n", "N"], get "M"() { return this["m"]; },
    ",": ["m", "M", ".", ">",           "e", "E"], get "<"() { return this[","]; },
    ".": [",", "<", "/", "?",           "i", "I"], get ">"() { return this["."]; },
    "/": [".", ">",                     "o", "O"], get "?"() { return this["/"]; }
};

layouts.DVORAK = {
      // ["l", "L", "r", "R", "d", "D", "u", "U"] top row
    "`": [          "1", "!"                    ], get "~"() { return this["`"]; },
    "1": ["`", "~", "2", "@", "'", '"'          ], get "!"() { return this["1"]; },
    "2": ["1", "!", "3", "#", ",", "<"          ], get "@"() { return this["2"]; },
    "3": ["2", "@", "4", "$", ".", ">"          ], get "#"() { return this["3"]; },
    "4": ["3", "#", "5", "%", "p", "P"          ], get "$"() { return this["4"]; },
    "5": ["4", "$", "6", "^", "y", "Y"          ], get "%"() { return this["5"]; },
    "6": ["5", "%", "7", "&", "f", "F"          ], get "^"() { return this["6"]; },
    "7": ["6", "^", "8", "*", "g", "G"          ], get "&"() { return this["7"]; },
    "8": ["7", "&", "9", "(", "c", "C"          ], get "*"() { return this["8"]; },
    "9": ["8", "*", "0", ")", "r", "R"          ], get "("() { return this["9"]; },
    "0": ["9", "(", "[", "{", "l", "L"          ], get ")"() { return this["0"]; },
    "[": ["0", ")", "]", "}", "/", "?"          ], get "{"() { return this["["]; },
    "]": ["[", "{",           "=", "+"          ], get "}"() { return this["]"]; },
      //  ["l", "L", "r",  "R", "d", "D", "u", "U"] second row
    "'":  [          ",",  "<", "a", "A", "1", "!"], get '"'() { return this["'"]; },
    ",":  ["'", '"', ".",  ">", "o", "O", "2", "@"], get "<"() { return this[","]; },
    ".":  [",", "<", "p",  "P", "e", "E", "3", "#"], get ">"() { return this["."]; },
    "p":  [".", ">", "y",  "Y", "u", "U", "4", "$"], get "P"() { return this["p"]; },
    "y":  ["p", "P", "f",  "F", "i", "I", "5", "%"], get "Y"() { return this["y"]; },
    "f":  ["y", "Y", "g",  "G", "d", "D", "6", "^"], get "F"() { return this["f"]; },
    "g":  ["f", "F", "c",  "C", "h", "H", "7", "&"], get "G"() { return this["g"]; },
    "c":  ["g", "G", "r",  "R", "t", "T", "8", "*"], get "C"() { return this["c"]; },
    "r":  ["c", "C", "l",  "L", "n", "N", "9", "("], get "R"() { return this["r"]; },
    "l":  ["r", "R", "/",  "?", "s", "S", "0", ")"], get "L"() { return this["l"]; },
    "/":  ["l", "L", "=",  "+", "-", "_", "[", "{"], get "?"() { return this["/"]; },
    "=":  ["/", "?", "\\", "|",           "]", "}"], get "+"() { return this["="]; },
    "\\": ["=", "+"                               ], get "|"() { return this["\\"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] third row
    "a": [          "o", "O", ";", ":", "'", '"'], get "A"() { return this["a"]; },
    "o": ["a", "A", "e", "E", ",", "<", "q", "Q"], get "O"() { return this["o"]; },
    "e": ["o", "O", "u", "U", ".", ">", "j", "J"], get "E"() { return this["e"]; },
    "u": ["e", "E", "i", "I", "p", "P", "k", "K"], get "U"() { return this["u"]; },
    "i": ["u", "U", "d", "D", "y", "Y", "x", "X"], get "I"() { return this["i"]; },
    "d": ["i", "I", "h", "H", "f", "F", "b", "B"], get "D"() { return this["d"]; },
    "h": ["d", "D", "t", "T", "g", "G", "m", "M"], get "H"() { return this["h"]; },
    "t": ["h", "H", "n", "N", "c", "C", "w", "W"], get "T"() { return this["t"]; },
    "n": ["t", "T", "s", "S", "r", "R", "v", "V"], get "N"() { return this["n"]; },
    "s": ["n", "N", "-", "_", "l", "L", "z", "Z"], get "S"() { return this["s"]; },
    "-": ["s", "S",                     "/", "?"], get "_"() { return this["-"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] fourth row
    ";": [          "q", "Q",           "a", "A"], get ":"() { return this[";"]; },
    "q": [";", ":", "j", "J",           "o", "O"], get "Q"() { return this["q"]; },
    "j": ["q", "Q", "k", "K",           "e", "E"], get "J"() { return this["j"]; },
    "k": ["j", "J", "x", "X",           "u", "U"], get "K"() { return this["k"]; },
    "x": ["k", "K", "b", "B",           "i", "I"], get "X"() { return this["x"]; },
    "b": ["x", "X", "m", "M",           "d", "D"], get "B"() { return this["b"]; },
    "m": ["b", "B", "w", "W",           "h", "H"], get "M"() { return this["m"]; },
    "w": ["m", "M", "v", "V",           "t", "T"], get "W"() { return this["w"]; },
    "v": ["w", "W", "z", "Z",           "n", "N"], get "V"() { return this["v"]; },
    "z": ["v", "V",                     "s", "S"], get "Z"() { return this["z"]; }
};

layouts.NORMAN = {
      // ["l", "L", "r", "R", "d", "D", "u", "U"] top row
    "`": [          "1", "!"                    ], get "~"() { return this["`"]; },
    "1": ["`", "~", "2", "@", "q", "Q"          ], get "!"() { return this["1"]; },
    "2": ["1", "!", "3", "#", "w", "W"          ], get "@"() { return this["2"]; },
    "3": ["2", "@", "4", "$", "d", "D"          ], get "#"() { return this["3"]; },
    "4": ["3", "#", "5", "%", "f", "F"          ], get "$"() { return this["4"]; },
    "5": ["4", "$", "6", "^", "k", "K"          ], get "%"() { return this["5"]; },
    "6": ["5", "%", "7", "&", "j", "J"          ], get "^"() { return this["6"]; },
    "7": ["6", "^", "8", "*", "u", "U"          ], get "&"() { return this["7"]; },
    "8": ["7", "&", "9", "(", "r", "R"          ], get "*"() { return this["8"]; },
    "9": ["8", "*", "0", ")", "l", "L"          ], get "("() { return this["9"]; },
    "0": ["9", "(", "[", "{", ";", ":"          ], get ")"() { return this["0"]; },
    "-": ["0", ")", "=", "+", "[", "{"          ], get "_"() { return this["-"]; },
    "=": ["-", "_",           "]", "}"          ], get "+"() { return this["="]; },
      //  ["l", "L", "r",  "R", "d", "D", "u", "U"] second row
    "q":  [          "w",  "W", "a", "A", "1", "!"], get "Q"() { return this["q"]; },
    "w":  ["q", "Q", "d",  "D", "s", "S", "2", "@"], get "W"() { return this["w"]; },
    "d":  ["w", "W", "f",  "F", "e", "D", "3", "#"], get "D"() { return this["d"]; },
    "f":  ["d", "D", "k",  "K", "t", "F", "4", "$"], get "F"() { return this["f"]; },
    "k":  ["f", "F", "j",  "J", "g", "G", "5", "%"], get "K"() { return this["k"]; },
    "j":  ["k", "K", "u",  "U", "y", "H", "6", "^"], get "J"() { return this["j"]; },
    "u":  ["j", "J", "r",  "R", "n", "J", "7", "&"], get "U"() { return this["u"]; },
    "r":  ["u", "U", "l",  "L", "i", "K", "8", "*"], get "R"() { return this["r"]; },
    "l":  ["r", "R", ";",  ";", "o", "L", "9", "("], get "L"() { return this["l"]; },
    ";":  ["l", "L", "[",  "{", "h", ":", "0", ")"], get ":"() { return this[";"]; },
    "[":  [";", ":", "]",  "}", "'", '"', "-", "_"], get "{"() { return this["["]; },
    "]":  ["[", "{", "\\", "|",           "=", "+"], get "}"() { return this["]"]; },
    "\\": [          "]",  "}"                    ], get "|"() { return this["\\"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] third row
    "a": [          "s", "S", "z", "Z", "q", "Q"], get "A"() { return this["a"]; },
    "s": ["a", "A", "e", "E", "x", "X", "w", "W"], get "S"() { return this["s"]; },
    "e": ["s", "S", "t", "T", "c", "C", "d", "D"], get "E"() { return this["e"]; },
    "t": ["e", "E", "g", "G", "v", "V", "f", "F"], get "T"() { return this["t"]; },
    "g": ["t", "T", "y", "Y", "b", "B", "k", "K"], get "G"() { return this["g"]; },
    "y": ["g", "G", "n", "N", "p", "P", "j", "J"], get "Y"() { return this["y"]; },
    "n": ["y", "Y", "i", "I", "m", "M", "u", "U"], get "N"() { return this["n"]; },
    "i": ["n", "N", "o", "O", ",", "<", "r", "R"], get "I"() { return this["i"]; },
    "o": ["i", "I", "h", "H", ".", ">", "l", "L"], get "O"() { return this["o"]; },
    "h": ["o", "O", "'", '"', "/", "?", ";", ":"], get "H"() { return this["h"]; },
    "'": ["h", "H",                     "[", "{"], get '"'() { return this["'"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] fourth row
    "z": [          "x", "X",           "a", "A"], get "Z"() { return this["z"]; },
    "x": ["z", "Z", "c", "c",           "s", "S"], get "X"() { return this["x"]; },
    "c": ["x", "X", "v", "V",           "e", "E"], get "C"() { return this["c"]; },
    "v": ["c", "C", "b", "B",           "t", "T"], get "V"() { return this["v"]; },
    "b": ["v", "V", "p", "P",           "g", "G"], get "B"() { return this["b"]; },
    "p": ["b", "B", "m", "M",           "y", "Y"], get "P"() { return this["p"]; },
    "m": ["p", "P", ",", "<",           "n", "N"], get "M"() { return this["m"]; },
    ",": ["m", "M", ".", ">",           "i", "I"], get "<"() { return this[","]; },
    ".": [",", "<", "/", "?",           "o", "O"], get ">"() { return this["."]; },
    "/": [".", ">",                     "h", "H"], get "?"() { return this["/"]; }
};

layouts.QWERTY = {
      // ["l", "L", "r", "R", "d", "D", "u", "U"] top row
    "`": [          "1", "!"                    ], get "~"() { return this["`"]; },
    "1": ["`", "~", "2", "@", "q", "Q"          ], get "!"() { return this["1"]; },
    "2": ["1", "!", "3", "#", "w", "W"          ], get "@"() { return this["2"]; },
    "3": ["2", "@", "4", "$", "e", "E"          ], get "#"() { return this["3"]; },
    "4": ["3", "#", "5", "%", "r", "R"          ], get "$"() { return this["4"]; },
    "5": ["4", "$", "6", "^", "t", "T"          ], get "%"() { return this["5"]; },
    "6": ["5", "%", "7", "&", "y", "Y"          ], get "^"() { return this["6"]; },
    "7": ["6", "^", "8", "*", "u", "U"          ], get "&"() { return this["7"]; },
    "8": ["7", "&", "9", "(", "i", "I"          ], get "*"() { return this["8"]; },
    "9": ["8", "*", "0", ")", "o", "O"          ], get "("() { return this["9"]; },
    "0": ["9", "(", "[", "{", "p", "P"          ], get ")"() { return this["0"]; },
    "-": ["0", ")", "=", "+", "[", "{"          ], get "_"() { return this["-"]; },
    "=": ["-", "_",           "]", "}"          ], get "+"() { return this["="]; },
      //  ["l", "L", "r",  "R", "d", "D", "u", "U"] second row
    "q":  [          "w",  "W", "a", "A", "1", "!"], get "Q"() { return this["q"]; },
    "w":  ["q", "Q", "e",  "E", "s", "S", "2", "@"], get "W"() { return this["w"]; },
    "e":  ["w", "W", "r",  "R", "d", "D", "3", "#"], get "E"() { return this["e"]; },
    "r":  ["e", "E", "t",  "T", "f", "F", "4", "$"], get "R"() { return this["r"]; },
    "t":  ["r", "R", "y",  "Y", "g", "G", "5", "%"], get "T"() { return this["t"]; },
    "y":  ["t", "T", "u",  "U", "h", "H", "6", "^"], get "Y"() { return this["y"]; },
    "u":  ["y", "Y", "i",  "I", "j", "J", "7", "&"], get "U"() { return this["u"]; },
    "i":  ["u", "U", "o",  "O", "k", "K", "8", "*"], get "I"() { return this["i"]; },
    "o":  ["i", "I", "p",  "P", "l", "L", "9", "("], get "O"() { return this["o"]; },
    "p":  ["o", "O", "[",  "{", ";", ":", "0", ")"], get "P"() { return this["p"]; },
    "[":  ["p", "P", "]",  "}", "'", '"', "-", "_"], get "{"() { return this["["]; },
    "]":  ["[", "{", "\\", "|",           "=", "+"], get "}"() { return this["]"]; },
    "\\": ["]", "}"                               ], get "|"() { return this["\\"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] third row
    "a": [          "s", "S", "z", "Z", "q", "Q"], get "A"() { return this["a"]; },
    "s": ["a", "A", "d", "D", "x", "X", "w", "W"], get "S"() { return this["s"]; },
    "d": ["s", "S", "f", "F", "c", "C", "e", "E"], get "D"() { return this["d"]; },
    "f": ["d", "D", "g", "G", "v", "V", "r", "R"], get "F"() { return this["f"]; },
    "g": ["f", "F", "h", "H", "b", "B", "t", "T"], get "G"() { return this["g"]; },
    "h": ["g", "G", "j", "J", "n", "N", "y", "Y"], get "H"() { return this["h"]; },
    "j": ["h", "H", "k", "K", "m", "M", "u", "U"], get "J"() { return this["j"]; },
    "k": ["j", "J", "l", "L", ",", "<", "i", "I"], get "K"() { return this["k"]; },
    "l": ["k", "K", ";", ":", ".", ">", "o", "O"], get "L"() { return this["l"]; },
    ";": ["l", "L", "'", '"', "/", "?", "p", "P"], get ":"() { return this[";"]; },
    "'": [";", ":",                     "[", "{"], get '"'() { return this["'"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] fourth row
    "z": [          "x", "X",           "a", "A"], get "Z"() { return this["z"]; },
    "x": ["z", "Z", "c", "c",           "s", "S"], get "X"() { return this["x"]; },
    "c": ["x", "X", "v", "V",           "d", "D"], get "C"() { return this["c"]; },
    "v": ["c", "C", "b", "B",           "f", "F"], get "V"() { return this["v"]; },
    "b": ["v", "V", "n", "N",           "g", "G"], get "B"() { return this["b"]; },
    "n": ["b", "B", "m", "M",           "h", "H"], get "N"() { return this["n"]; },
    "m": ["n", "N", ",", "<",           "j", "J"], get "M"() { return this["m"]; },
    ",": ["m", "M", ".", ">",           "k", "K"], get "<"() { return this[","]; },
    ".": [",", "<", "/", "?",           "l", "L"], get ">"() { return this["."]; },
    "/": [".", ">",                     ";", ":"], get "?"() { return this["/"]; }
};

layouts.WORKMAN = {
      // ["l", "L", "r", "R", "d", "D", "u", "U"] top row
    "`": [          "1", "!"                    ], get "~"() { return this["`"]; },
    "1": ["`", "~", "2", "@", "q", "Q"          ], get "!"() { return this["1"]; },
    "2": ["1", "!", "3", "#", "d", "D"          ], get "@"() { return this["2"]; },
    "3": ["2", "@", "4", "$", "r", "R"          ], get "#"() { return this["3"]; },
    "4": ["3", "#", "5", "%", "w", "W"          ], get "$"() { return this["4"]; },
    "5": ["4", "$", "6", "^", "b", "B"          ], get "%"() { return this["5"]; },
    "6": ["5", "%", "7", "&", "j", "J"          ], get "^"() { return this["6"]; },
    "7": ["6", "^", "8", "*", "f", "F"          ], get "&"() { return this["7"]; },
    "8": ["7", "&", "9", "(", "u", "U"          ], get "*"() { return this["8"]; },
    "9": ["8", "*", "0", ")", "p", "P"          ], get "("() { return this["9"]; },
    "0": ["9", "(", "[", "{", ";", ":"          ], get ")"() { return this["0"]; },
    "-": ["0", ")", "=", "+", "[", "{"          ], get "_"() { return this["-"]; },
    "=": ["-", "_",           "]", "}"          ], get "+"() { return this["="]; },
      //  ["l", "L", "r",  "R", "d", "D", "u", "U"] second row
    "q":  [          "d",  "D", "a", "A", "1", "!"], get "Q"() { return this["q"]; },
    "d":  ["q", "Q", "r",  "R", "s", "S", "2", "@"], get "D"() { return this["d"]; },
    "r":  ["d", "D", "w",  "W", "h", "H", "3", "#"], get "R"() { return this["r"]; },
    "w":  ["r", "R", "b",  "B", "t", "T", "4", "$"], get "W"() { return this["w"]; },
    "b":  ["w", "W", "j",  "J", "g", "G", "5", "%"], get "B"() { return this["b"]; },
    "j":  ["b", "B", "f",  "F", "y", "Y", "6", "^"], get "J"() { return this["j"]; },
    "f":  ["j", "J", "u",  "U", "n", "N", "7", "&"], get "F"() { return this["f"]; },
    "u":  ["f", "F", "p",  "P", "e", "E", "8", "*"], get "U"() { return this["u"]; },
    "p":  ["u", "U", ";",  ":", "o", "O", "9", "("], get "P"() { return this["p"]; },
    ";":  ["p", "P", "[",  "{", "i", "I", "0", ")"], get ":"() { return this[";"]; },
    "[":  [";", ":", "]",  "}", "'", '"', "-", "_"], get "{"() { return this["["]; },
    "]":  ["[", "{", "\\", "|",           "=", "+"], get "}"() { return this["]"]; },
    "\\": ["]", "}"                               ], get "|"() { return this["\\"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] third row
    "a": [          "s", "S", "z", "Z", "q", "Q"], get "A"() { return this["a"]; },
    "s": ["a", "A", "h", "H", "x", "X", "d", "D"], get "S"() { return this["s"]; },
    "h": ["s", "S", "t", "T", "m", "M", "r", "R"], get "H"() { return this["h"]; },
    "t": ["h", "H", "g", "G", "c", "C", "w", "W"], get "T"() { return this["t"]; },
    "g": ["t", "T", "y", "Y", "v", "V", "b", "B"], get "G"() { return this["g"]; },
    "y": ["g", "G", "n", "N", "k", "K", "j", "J"], get "Y"() { return this["y"]; },
    "n": ["y", "Y", "e", "E", "l", "L", "f", "F"], get "N"() { return this["n"]; },
    "e": ["n", "N", "o", "O", ",", "<", "u", "U"], get "E"() { return this["e"]; },
    "o": ["e", "E", "i", "I", ".", ">", "p", "P"], get "O"() { return this["o"]; },
    "i": ["o", "O", "'", '"', "/", "?", ";", ":"], get "I"() { return this["i"]; },
    "'": ["i", "I",                     "[", "{"], get '"'() { return this["'"]; },
      // ["l", "L", "r", "R", "d", "D", "u", "U"] fourth row
    "z": [          "x", "X",           "a", "A"], get "Z"() { return this["z"]; },
    "x": ["z", "Z", "m", "M",           "s", "S"], get "X"() { return this["x"]; },
    "m": ["x", "X", "c", "C",           "h", "H"], get "M"() { return this["m"]; },
    "c": ["m", "M", "v", "V",           "t", "T"], get "C"() { return this["c"]; },
    "v": ["c", "C", "k", "K",           "g", "G"], get "V"() { return this["v"]; },
    "k": ["v", "V", "l", "L",           "y", "Y"], get "K"() { return this["k"]; },
    "l": ["k", "K", ",", "<",           "n", "N"], get "L"() { return this["l"]; },
    ",": ["l", "L", ".", ">",           "e", "E"], get "<"() { return this[","]; },
    ".": [",", "<", "/", "?",           "o", "O"], get ">"() { return this["."]; },
    "/": [".", ">",                     "i", "I"], get "?"() { return this["/"]; },
};
