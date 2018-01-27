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
  const namespace = target.name || target.constructor.name;
  if (typeof target === 'function') {
    // static type
    target[key] = `${namespace}/${key}`;
    return target;
  } else {
    // instance type
    return {
      get () {
        return `${namespace}[${this.key}]/${key}`;
      }
    };
  }
}

export function apiTypeDef (target: any, key: string): any {
  const namespace = target.name || target.constructor.name;
  if (typeof target === 'function') {
    // static api type
    target[key] = getApiCallType(key, namespace);
    return target;
  } else {
    // instance api type
    return {
      get () {
        return getApiCallType(key, namespace, this.key);
      }
    };
  }
}
