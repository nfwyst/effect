import React from 'react';
import ReactDOM from 'react-dom';
import './css/bootstrap.css';
import './index.css';
import  RbcompilerIDE from './rbcompilerIDE';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<RbcompilerIDE />, document.getElementById('root'));
registerServiceWorker();
