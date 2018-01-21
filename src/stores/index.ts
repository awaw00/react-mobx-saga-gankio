import { BaseStore } from '../framework';

BaseStore.init({
  axiosConfig: {
    baseURL: 'http://gank.io/api/'
  }
});

import GankStore from './GankStore';
import GankUIStore from './GankUIStore';

export const gankStore = new GankStore('_gank');
export const gankUIStore = new GankUIStore('gank', gankStore);