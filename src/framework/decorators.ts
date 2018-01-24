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

export function typeDef (target: any, key: string) {
  const namespace = target.name;
  let value = target[key];
  if (typeof value !== 'string') {
    value = key;
  }

  target[key] = `${namespace}/${value}`;
  return target;
}

export function apiTypeDef (target: any, key: string) {
  const namespace = target.name;
  let value = target[key];
  if (typeof value !== 'string') {
    value = key;
  }

  target[key] = getApiCallType(value, namespace);
  return target;
}
