import { toJS, observable, runInAction, ObservableMap, autorun, action } from 'mobx';
import { GankType } from '../constants';
import { GankDataCache, GankApiResponse, GankDataItem } from '../types';
import { BaseStore, getRequestType, bind, apiCallWith } from '../framework';

export default class GankStore extends BaseStore {
  static readonly GANK_GET_NEXT_PAGE_DATA_OF_TYPE = getRequestType('GANK_GET_NEXT_PAGE_DATA_OF_TYPE');
  static readonly GANK_GET_PUBLISHED_DATES = getRequestType('GANK_GET_PUBLISHED_DATES');
  static readonly GANK_GET_DATA_OF_DATE = getRequestType('GANK_GET_DATA_OF_DATE');

  dataCache: ObservableMap<GankDataCache> = observable.map({});

  @observable
  publishedDates: {data: string[], loading: boolean};

  @observable
  dataOfDate: {date: string, data: GankDataItem[], loading: boolean};

  constructor (public key: string) {
    super(key);
  }

  @apiCallWith(GankStore.GANK_GET_NEXT_PAGE_DATA_OF_TYPE)
  getNextPageDataOfType ({type}: {type: GankType}) {
    let nextPage = 1;
    if (!this.dataCache.has(type)) {
      this.dataCache.set(type, {data: [], currentPage: 0, loading: false});
    }
    const dataCache = this.dataCache.get(type);
    if (dataCache) {
      nextPage = dataCache.currentPage + 1;
      dataCache.loading = true;
    }

    return this.http.get(`/data/${type}/10/${nextPage}`)
      .then(res => res.data)
      .then(action(`更新第[${nextPage}]页类型为[${type}]的干货数据`, (data: GankApiResponse<GankDataItem[]>) => {
        if (dataCache) {
          dataCache.loading = false;
          dataCache.data = dataCache.data.concat(data.results);
          dataCache.currentPage = nextPage;
        }
        return data;
      }));
  }
}
