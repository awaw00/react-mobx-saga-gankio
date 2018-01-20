import { computed, observable, action } from 'mobx';
import { BaseStore } from '../framework';
import GankStore from './GankStore';
import { GankType } from '../constants';
import { GankDataCache } from '../types';

export default class GankUIStore extends BaseStore {
  @observable
  showMenu: boolean = true;

  @observable
  currentType: GankType = GankType.All;

  @computed
  get dataCache (): GankDataCache {
    let dataCache;
    if (this.gankStore) {
      dataCache = this.gankStore.dataCache.get(this.currentType);
    }
    if (!dataCache) {
      dataCache = {loading: false, data: [], currentPage: 0};
    }

    return dataCache;
  }

  @computed
  get data () {
    return this.dataCache.data;
  }

  @computed
  get loading () {
    return this.dataCache.loading;
  }

  @action('切换干货类型')
  switchGankType (type: GankType) {
    const dataCache = this.gankStore.dataCache.get(this.currentType);
    if (dataCache && dataCache.loading) {
      dataCache.loading = false;
    }

    if (this.showMenu) {
      this.showMenu = false;
    }

    this.currentType = type;
  }

  @action('切换菜单展示或隐藏')
  switchMenuShow (show: boolean) {
    this.showMenu = show;
  }

  constructor (public key: string, protected gankStore: GankStore) {
    super(key);
  }
}
