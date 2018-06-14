class Token {
  constructor(type, literal, lineNumber) {
    this.tokenType = type;
    this.literal = literal;
    this.lineNumber = lineNumber;
  }

  type() {
    return this.tokenType;
  }

  literal() {
    return this.literal;
  }

  lineNumber() {
    return this.lineNumber;
  }
}

// 符号表

// 词法扫描器
class Lexer {
  constructor(sourceCode) {
    this.initTokenType();
    this.initKeyWords();
    // 扫描缓冲区
    this.sourceCode = sourceCode || '';
    this.position = 0;
    this.readPosition = 0;
    this.lineCount = 0;
    this.ch = '';
    this.flag = false;
  }

  initTokenType() {
    this.ILLEGAL = -2; // this token is not valid
    this.EOF = -1; // end of text
    this.LET = 0;
    this.IDENTIFIER = 1;
    this.EQUAL_SIGN = 2;
    this.PLUS_SIGN = 3;
    this.INTEGER = 4;
    this.SEMICOLON = 5;
    this.IF = 6;
    this.ELSE = 7;
  }

  // 保留字表
  initKeyWords() {
    this.keyMap = {};
    this.keyMap['let'] = new Token(this.LET, 'let', 0);
    this.keyMap['if'] = new Token(this.IF, 'if', 0);
    this.keyMap['else'] = new Token(this.ELSE, 'else', 0);
  }

  getKeyWords() {
    return this.keyMap;
  }

  // 设置观察者
  setLexingObserver(obj, context) {
    if (obj !== null && obj !== undefined) {
      this.observer = obj;
      this.observerContext = context;
    }
  }

  notifyObserver(token) {
      this.observer.notifyTokenCreation(token, this.observerContext, this.position, this.readPosition);
  }

  // 每一次从文本字符串中读取一个字符
  readChar() {
    if(this.readPosition >= this.sourceCode.length) {
      // 表示字符串读完了
      this.ch = '-0';
    } else {
      // 字符串没读完, 读取下一个位置的字符
      this.ch = this.sourceCode[this.readPosition];
    }

    this.readPosition++;
  }

  // 忽略空格和回车换行符并记录行号
  skipWhiteSpaceAndNewLine() {
    // 回车换行增加行号, 读取一个有效字符
    while(this.ch === ' ' || this.ch === '\n' || this.ch === '\t') {
      if(this.ch === '\n' || this.ch === '\t') {
        this.lineCount++;
      }
      this.readChar();
    }
  }

  isNumber(ch) {
    return ('0' <= ch && ch <= '9');
  }

  readNumber() {
    let number = "";
    while (this.isNumber(this.ch)) {
      number += this.ch;
      this.readChar();
    }
    if (number.length > 0) {
      this.flag = true;
      return number;
    } else {
      return false;
    }
  }

  isAlpha(ch) {
    return (ch >= 'a' && ch <= 'z') ||
          (ch >= 'A' && ch <= 'Z') || (ch === '_');
  }

  readIdentifier() {
    let identifier = "";
    while (this.isAlpha(this.ch)) {
      identifier += this.ch;
      this.readChar();
    }
    if (identifier.length > 0) {
      this.flag = true;
      return identifier;
    } else {
      return false;
    }
  }

  // 读取下一个记号
  nextToken() {
    let tok;
    if (!this.flag) {
      this.readChar();
    }
    this.skipWhiteSpaceAndNewLine();

    this.position = this.readPosition;

    switch (this.ch) {
      case '=':
        tok = new Token(this.EQUAL_SIGN, '=', this.lineCount);
        this.flag = false;
        break;
      case '+':
        tok = new Token(this.PLUS_SIGN, '+', this.lineCount);
        this.flag = false;
        break;
      case ';':
        tok = new Token(this.SEMICOLON, ';', this.lineCount);
        this.flag = false;
        break;
      case '-0':
        tok = new Token(this.EOF, "", this.lineCount);
        break;
      default:
        let res = this.readIdentifier();
        if (res !== false) {
          if (this.keyMap[res] !== undefined) {
            tok = this.keyMap[res];
          } else {
            tok = new Token(this.IDENTIFIER, res, this.lineCount);
          }
        } else {
          res = this.readNumber();
          if (res !== false) {
              tok = new Token(this.INTEGER, res, this.lineCount);
          }
        }

        if (res === false) {
          tok = undefined;
        }
    }
    // 当前解析的token 通知给观察者(这里是语法解析器)
    if(tok !== undefined) {
      // TODO need to change
      // this.notifyObserver(tok);
    }
    return tok;
  }

  // 解析记号
  lexing() {
    let tokens = [];
    let token = undefined;
    do {
      token = this.nextToken();
      tokens.push(token);
    } while(token.type() !== this.EOF);
    for (var i = 0; i < tokens.length; i++) {
      console.log(tokens[i]);
    }
  }
}

// for test
// 输入缓冲区
// let source = 'let x = y + 4\n6';
// 预处理子程序
// source.trim();
// let lexer = new Lexer(source);
// lexer.lexing();

export default Lexer
