import { Provider } from 'mobx-react';
import * as React from 'react';
import MainPage from './pages/MainPage';
import { gankUIStore } from './stores';

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
