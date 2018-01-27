import { BaseStore, apiCallWith, bind, getApiCallType, typeDef, apiTypeDef } from '../framework';
import { delay } from 'redux-saga';
import { put, take, call, race, all } from 'redux-saga/effects';
import { ApiCallType } from '../framework/types';

describe('BaseStore test', () => {

  beforeEach(() => {
    // console.log = jest.fn(() => void 0);
    console.error = jest.fn(() => void 0);
    console.warn = jest.fn(() => void 0);
    console.info  = jest.fn(() => void 0);

    BaseStore.reset();
  });

  test('static auto init', () => {
    const store = new BaseStore('test');
    expect(BaseStore.initialized).toBe(true);
  });

  test('bind member function', () => {
    class BindTest extends BaseStore {
      @apiTypeDef static readonly API_TYPE: ApiCallType;
      constructor (public key: string) {
        super(key);
      }

      @bind
      func () {
        return this;
      }

      @apiCallWith('API_TYPE')
      funcApiCallWith () {
        return this;
      }

      @bind
      *generatorFunc () {
        yield this;
      }
    }

    const bindTest = new BindTest('test');
    const func = bindTest.func;
    const funcApiCallWith = bindTest.funcApiCallWith;

    expect(func()).toEqual(bindTest);
    expect(funcApiCallWith()).toEqual(bindTest);

    const generatorFunc = bindTest.generatorFunc;
    const gen = generatorFunc();

    expect(gen.next().value).toEqual(bindTest);
  });

  test('apiCallWith', () => {
    class ApiCallWithTest extends BaseStore {
      @apiTypeDef static readonly API_WILL_SUCCESS: ApiCallType;
      @apiTypeDef static readonly API_WILL_FAILURE: ApiCallType;

      @apiTypeDef static readonly API_PRIORITY_TEST: ApiCallType;
      @apiTypeDef readonly API_PRIORITY_TEST: ApiCallType;

      constructor (public key: string) {
        super(key);
      }

      @apiCallWith('API_WILL_SUCCESS')
      successApi (params: any) {
        return Promise.resolve(params);
      }

      @apiCallWith('API_WILL_FAILURE')
      failureApi (params: any) {
        return Promise.reject('failure');
      }

      @apiCallWith('API_PRIORITY_TEST')
      priorityTestApi (params: any) {
        return Promise.resolve(params);
      }
    }

    const apiCallWithTest = new ApiCallWithTest('test');

    return apiCallWithTest.runSaga(function * () {
      const params = {id: 123};

      const {timeout, res} = yield race({
        timeout: call(delay, 10000),
        res: all([
          take(ApiCallWithTest.API_WILL_SUCCESS.SUCCESS),
          take(ApiCallWithTest.API_WILL_FAILURE.FAILURE),
          take(apiCallWithTest.API_PRIORITY_TEST.SUCCESS),
          put({type: ApiCallWithTest.API_WILL_SUCCESS.REQUEST, payload: params}),
          put({type: ApiCallWithTest.API_WILL_FAILURE.REQUEST, payload: params}),
          put({type: apiCallWithTest.API_PRIORITY_TEST.REQUEST, payload: params})
        ])
      });

      expect(timeout).toBe(undefined);
      expect(res[0].payload).toEqual(params);
      expect(res[1].payload).toBe('failure');
      expect(res[2].payload).toEqual(params);

    }).done;
  });
});
