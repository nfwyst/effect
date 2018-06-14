import React,{ Component } from 'react';
import * as bootstrap from 'react-bootstrap';
import Lexer from './rbcompilerLexer';
import RbcompilerEditor from './rbcompilerEditor';

class RbcompilerIDE extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
    this.lexer = new Lexer();
  }
  onLexingClick( e ) {
    let box = document.getElementById("box");
    this.lexer = new Lexer(box.innerHTML);
    this.lexer.lexing();
  }
  render() {
    return (
      <bootstrap.Panel header="在线编译器" bsStyle="success">
          <bootstrap.FormGroup>
            <RbcompilerEditor keyWords={ this.lexer.getKeyWords() }
              ref = {(ref) => { this.inputInstance = ref}}
            />
          </bootstrap.FormGroup>
          <bootstrap.Button bsStyle="danger" onClick={this.onLexingClick.bind(this)}>
              解析
          </bootstrap.Button>
      </bootstrap.Panel>
    );
  }
}

export default RbcompilerIDE;
