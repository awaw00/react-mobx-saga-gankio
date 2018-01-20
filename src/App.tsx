import { Provider } from 'mobx-react';
import * as React from 'react';
import MainPage from './pages/MainPage';
import './App.css';

import GankStore from './stores/GankStore';
import GankUIStore from './stores/GankUIStore';

const gankStore = new GankStore('_gank');
const gankUIStore = new GankUIStore('gank', gankStore);

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <Provider gank={gankUIStore}>
        <MainPage/>
      </Provider>
    );
  }
}

export default App;
