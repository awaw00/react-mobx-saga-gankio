import { ApiTypeConfig, RequestType } from './interfaces';

export function apiType (requestType: RequestType, config: ApiTypeConfig = {}): MethodDecorator {
  return function (target: any, key: string, descriptor: any) {
    config.requestType = requestType;
    descriptor.value.$apiType = config;
    descriptor.value.$bind = true;
    return descriptor;
  };
}

export function bind (target: any, key: string, descriptor: any) {
  descriptor.value.$bind = true;
  return descriptor;
}
