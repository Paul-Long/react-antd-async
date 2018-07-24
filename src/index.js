import React from 'react';
import ReactDOM from 'react-dom';
import { Button, message } from 'antd';

const container = document.querySelector('#app');
ReactDOM.render((
  <div>
    <h1>
      hello world!
    </h1>
    <Button onClick={() => {
      message.info('show message');
    }}>show message</Button>
  </div>
), container);
