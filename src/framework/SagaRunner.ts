import { ActionWithPayload } from './types';
import { runSaga, END } from 'redux-saga';

type Callback = (cb: (ActionWithPayload | END)) => void;

class SagaRunner {
  
  private subscribes: Callback[] = [];
  private stores: {[name: string]: any} = {};

  constructor () {
    this.subscribe = this.subscribe.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.runSaga = this.runSaga.bind(this);
  }

  dispatch (action: ActionWithPayload) {
    const arr = this.subscribes.slice();
    for (let i = 0, len =  arr.length; i < len; i++) {
      arr[i](action);
    }

    return action;
  }
  
  runSaga (saga: () => Iterator<any>) {
    return runSaga<ActionWithPayload, any>(
      {
        subscribe: this.subscribe,
        dispatch: this.dispatch,
        getState: () => this.stores
      },
      saga
    );
  }

  registerStore (key: string, store: any) {
    if (this.stores[key]) {
      throw new Error('已存在key: ' + key);
    }
    this.stores[key] = store;
  }

  unRegisterStore (key: string) {
    if (this.stores[key]) {
      delete this.stores[key];
    }
  }

  private subscribe (callback: Callback) {
    this.subscribes.push(callback);
    return () => {
      const index = this.subscribes.indexOf(callback);
      if (index >= 0) {
        this.subscribes.splice(index, 1);
      }
    };
  }
}

export default SagaRunner;
