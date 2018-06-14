import React, { Component } from 'react';
import Lexer from './rbcompilerLexer';

class RbcompilerEditor extends Component {
  constructor(props) {
      super(props);
      this.keyWords = props.keyWords;
      // this.keyWordElementArray = [];
      // this.lastBegin = 0
  }

  changeNode(n) {
    var f = n.childNodes;
    for (var i in f) {
      this.changeNode(f[i]);
    }
    if(n.data) {
      console.log(n.parentNode.innerHTML);
      this.lastBegin = 0;
      n.keyWordCount = 0;
      var lexer =  new Lexer(n.data);
      lexer.setLexingObserver(this, n);
      lexer.lexing();
    }
  }

  // 监听者接口
  notifyTokenCreation(token, elementNode, begin, end) {
      if (this.keyWords[token.literal] !== undefined) {
          var e = {};
          e.node = elementNode;
          e.begin = begin;
          e.end = end;
          e.token = token;
          elementNode.keyWordCount++;
          this.keyWordElementArray.push(e);
      }
  }
  render() {
    let textAreaStyle = {
      height: 480,
      border: '1px solid black'
    };
    return (
      <div style ={textAreaStyle} id="box"
        contentEditable></div>
    );
  }
}

export default RbcompilerEditor;
