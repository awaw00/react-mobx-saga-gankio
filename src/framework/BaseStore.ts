import invariant from './invariant';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ActionWithPayload, ApiCallType, ApiCallWithConfig } from './types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { isApiType } from './utils';
import SagaRunner from './SagaRunner';

type BaseStoreStaticConfig = {
  axiosConfig?: AxiosRequestConfig,
};

type BaseStoreConfig = {
  sagaRunner?: SagaRunner;
};

export default class BaseStore {
  static initialized: boolean = false;
  static sagaRunner: SagaRunner;
  static http: AxiosInstance;

  http: AxiosInstance;
  sagaRunner: SagaRunner;

  static init (baseStoreConfig?: BaseStoreStaticConfig) {
    BaseStore.http = axios.create(baseStoreConfig && baseStoreConfig.axiosConfig);
    BaseStore.sagaRunner = new SagaRunner();
    BaseStore.initialized = true;
  }

  static reset () {
    BaseStore.http = void 0;
    BaseStore.sagaRunner = void 0;
    BaseStore.initialized = false;
  }

  constructor (public key: string, baseStoreConfig?: BaseStoreConfig) {
    if (!BaseStore.initialized) {
      BaseStore.init();
    }

    invariant(
      key !== '',
      'store.key couldn\'t be an empty string'
    );

    if (!baseStoreConfig) {
      baseStoreConfig = {};
    }

    this.http = BaseStore.http;
    this.sagaRunner = baseStoreConfig.sagaRunner || BaseStore.sagaRunner;

    this.sagaRunner.registerStore(key, this);

    this.dispatch = this.dispatch.bind(this);
    this.runSaga = this.runSaga.bind(this);

    this.processDecoratedMethods();
  }

  dispatch (action: ActionWithPayload) {
    return this.sagaRunner.dispatch(action);
  }

  runSaga (saga: () => Iterator<any>) {
    return this.sagaRunner.runSaga(saga);
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
      const $apiCallWith = this[i].$apiCallWith;
      if (this[i].$bind) {
        this[i] = this[i].bind(this);
      }
      if ($apiCallWith) {
        this.runCallWithSaga(i, $apiCallWith);
      }
    });
  }

  private runCallWithSaga (funcName: string, apiCallWithConfig: ApiCallWithConfig) {
    const func = this[funcName];

    const {apiCallTypeName} = apiCallWithConfig;

    // try get instance type first
    let apiCallType: ApiCallType = this[apiCallTypeName] || this.constructor[apiCallTypeName];

    invariant(
      isApiType(apiCallType),
      'invalid apiCallType: %s',
      JSON.stringify(apiCallType)
    );

    this.runSaga(function * () {
      yield takeLatest(apiCallType.REQUEST, function * ({payload}: ActionWithPayload) {
        try {
          const data = yield call(func, payload);
          yield put({type: apiCallType.SUCCESS, payload: data});
        } catch (err) {
          yield put({type: apiCallType.FAILURE, payload: err});
          console.error(err);
        }
      });
    });
  }
}
