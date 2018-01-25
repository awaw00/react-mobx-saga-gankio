import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ActionWithPayload, ApiCallType, ApiCallWithConfig } from './types';
import { put, takeLatest, call } from 'redux-saga/effects';
import { isApiType } from './utils';
import SagaRunner from './SagaRunner';

type BaseStoreStaticConfig = {
  axiosConfig?: AxiosRequestConfig,
};

type BaseStoreConfig = {
  key?: string;
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

  constructor (public keyOrConfig?: string | BaseStoreConfig, baseStoreConfig?: BaseStoreConfig) {
    if (!BaseStore.initialized) {
      BaseStore.init();
    }

    if (!baseStoreConfig) {
      baseStoreConfig = {};
    }
    if (typeof keyOrConfig === 'string') {
      baseStoreConfig.key = keyOrConfig;
    } else if (keyOrConfig) {
      baseStoreConfig = keyOrConfig;
    }

    this.http = BaseStore.http;
    this.sagaRunner = baseStoreConfig.sagaRunner || BaseStore.sagaRunner;

    if (baseStoreConfig.key) {
      this.sagaRunner.registerStore(baseStoreConfig.key, this);
    }

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

    let apiCallType = this.constructor[apiCallTypeName];

    if (isApiType(apiCallType)) {
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
    } else {
      throw new Error('apiCallType is not valid');
    }
  }
}
