import { ApiCallType } from './types';

export function getApiCallType (baseType: string, namespace?: string, key?: string): ApiCallType {
  if (namespace) {
    namespace += (key ? `[${key}]` : '') + '/';
  } else {
    namespace = '';
  }

  const slicer = '|';

  return {
    PRE_REQUEST: `${namespace}${baseType}${slicer}PRE_REQUEST`,
    REQUEST: `${namespace}${baseType}${slicer}REQUEST`,
    SUCCESS: `${namespace}${baseType}${slicer}SUCCESS`,
    FAILURE: `${namespace}${baseType}${slicer}FAILURE`,
  };
}

export function isApiType (type: any): type is ApiCallType {
  return type && type.PRE_REQUEST && type.REQUEST && type.SUCCESS && type.FAILURE;
}
