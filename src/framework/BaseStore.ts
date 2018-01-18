import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ActionWithPayload, RequestType, ApiTypeConfig } from './types';
import { put, takeLatest, call } from 'redux-saga/effects';
import SagaRunner from './SagaRunner';

type BaseStoreConfig = {
  axiosConfig?: AxiosRequestConfig,
  sagaRunnerConfig?: any
};

export default class BaseStore {
  static initialized: boolean = false;
  static sagaRunner: SagaRunner;
  static http: AxiosInstance;

  http: AxiosInstance = BaseStore.http;
  axios = axios;

  static init (baseStoreConfig?: BaseStoreConfig) {
    BaseStore.http = axios.create(baseStoreConfig && baseStoreConfig.axiosConfig);
    BaseStore.sagaRunner = new SagaRunner();
    BaseStore.initialized = true;
  }

  constructor (protected key: string) {
    if (!BaseStore.initialized) {
      BaseStore.init();
    }

    BaseStore.sagaRunner.registerStore(key, this);
    this.processDecoratedMethods();
  }

  dispatch (action: ActionWithPayload): void {
    BaseStore.sagaRunner.dispatch(action);
  }

  runSaga (saga: () => Iterator<any>) {
    BaseStore.sagaRunner.runSaga(saga);
  }

  private processDecoratedMethods () {
    const funcNameList = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(
      i => {
        return (
          ['constructor'].indexOf(i) < 0 &&
          typeof this[i] === 'function'
        );
      }
    );

    funcNameList.forEach(i => {
      if (this[i].$bind) {
        this[i] = this[i].bind(this);
      }
      if (this[i].$apiType) {
        this.runCallWithSaga(i);
      }
    });
  }

  private runCallWithSaga (funcName: string) {
    const self = this;
    const func = self[funcName];

    const apiTypeConfig = func.$apiType as ApiTypeConfig;
    const {requestType, receiverKey} = apiTypeConfig;

    if (requestType) {
      this.runSaga(function * () {
        yield takeLatest(requestType.REQUEST, function * ({payload}: ActionWithPayload) {
          try {
            const data = yield call(func, payload);
            yield put({type: requestType.SUCCESS, payload: {data}});

            if (receiverKey) {
              self[receiverKey] = data;
            }
          } catch (err) {
            yield put({type: requestType.FAILURE, payload: {err}});
          }
        });
      });
    }
  }
}
