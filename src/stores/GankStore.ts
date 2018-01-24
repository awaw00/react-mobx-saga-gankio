import { observable, runInAction, ObservableMap } from 'mobx';
import { put, call, take, takeLatest } from 'redux-saga/effects';
import { GankType } from '../constants';
import { GankDataCache, GankApiResponse, GankDataItem } from '../types';
import { BaseStore, typeDef, apiTypeDef, bind, apiCallWith } from '../framework';
import { ApiCallType } from '../framework/types';
import { ActionWithPayload } from '../framework/types';

export default class GankStore extends BaseStore {
  @apiTypeDef static readonly GANK_GET_NEXT_PAGE_DATA_OF_TYPE: ApiCallType;

  dataCache: ObservableMap<GankDataCache> = observable.map({});

  @observable
  dataCacheLoading: boolean = false;

  constructor (public key: string) {
    super(key);
    this.runSaga(this.sagaMain);
  }

  @bind
  *sagaMain () {
    yield takeLatest(GankStore.GANK_GET_NEXT_PAGE_DATA_OF_TYPE.PRE_REQUEST, this.handleGetPageDataOfTypePreRequest);
  }

  @bind
  *handleGetPageDataOfTypePreRequest ({payload}: ActionWithPayload<{type: GankType}>) {
    const self = yield this;
    self.dataCacheLoading = false;

    const {type} = payload;

    yield call<any>(runInAction, () => {
      if (!self.dataCache.has(type)) {
        self.dataCache.set(type, {data: [], currentPage: 0});
      }
      self.dataCacheLoading = true;
    });

    const cache = self.dataCache.get(type);
    const nextPage = cache.currentPage + 1;

    yield put({type: GankStore.GANK_GET_NEXT_PAGE_DATA_OF_TYPE.REQUEST, payload: {type, page: nextPage}});

    const sagaAction = yield take(GankStore.GANK_GET_NEXT_PAGE_DATA_OF_TYPE.SUCCESS);
    const res = sagaAction.payload as GankApiResponse<GankDataItem[]>;

    yield call<any>(runInAction, () => {
      cache.data = cache.data.concat(res.results);
      cache.currentPage = nextPage;

      self.dataCacheLoading = false;
    });
  }

  @apiCallWith('GANK_GET_NEXT_PAGE_DATA_OF_TYPE')
  getPageDataOfType ({type, page}: {type: GankType, page: number}) {
    return this.http.get(`/data/${type}/10/${page}`)
      .then(res => res.data as GankApiResponse<GankDataItem[]>);
  }
}
