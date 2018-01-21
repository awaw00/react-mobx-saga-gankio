import DevTools from 'mobx-react-devtools';

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
