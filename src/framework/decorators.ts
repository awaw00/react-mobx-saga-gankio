import { ApiCallWithConfig, ApiCallType } from './types';
import { getApiCallType } from './utils';

export function apiCallWith (apiCallTypeName: string, config: ApiCallWithConfig = {}): MethodDecorator {
  return function (target: any, key: string, descriptor: any) {
    config.apiCallTypeName = apiCallTypeName;
    descriptor.value.$apiCallWith = config;
    descriptor.value.$bind = true;
    return descriptor;
  };
}

export function bind (target: any, key: string, descriptor: any) {
  descriptor.value.$bind = true;
  return descriptor;
}

export function typeDef (target: any, key: string, descriptor?: any): any {
  if (typeof target === 'function') {
    // static type
    const namespace = target.name;
    target[key] = `${namespace}/${key}`;
    return target;
  } else {
    // instance type
    return {
      get () {
        const cacheKey = '__' + key;
        if (!this[cacheKey]) {
          const namespace = this.constructor.name;
          this[cacheKey] = `${namespace}[${this.key}]/${key}`;
        }
        return this[cacheKey];
      }
    };
  }
}

export function apiTypeDef (target: any, key: string): any {
  if (typeof target === 'function') {
    // static api type
    const namespace = target.name;
    target[key] = getApiCallType(key, namespace);
    return target;
  } else {
    // instance api type
    return {
      get () {
        const cacheKey = '__' + key;
        if (!this[cacheKey]) {
          const namespace = this.constructor.name;
          this[cacheKey] = getApiCallType(key, namespace, this.key);
        }
        return this[cacheKey];
      }
    };
  }
}
