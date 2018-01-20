import { BaseStore } from './framework';
import DevTools from 'mobx-react-devtools';

BaseStore.init({
  axiosConfig: {
    baseURL: 'http://gank.io/api/'
  }
});

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  [<App key="app"/>, <DevTools key="dev-tool"/>],
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
