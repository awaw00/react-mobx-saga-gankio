import { ApiCallType } from './types';

export function getApiCallType (baseType: string, namespace?: string): ApiCallType {
  if (namespace) {
    return {
      PRE_REQUEST: `${namespace}/${baseType}#PRE_REQUEST`,
      REQUEST: `${namespace}/${baseType}#REQUEST`,
      SUCCESS: `${namespace}/${baseType}#SUCCESS`,
      FAILURE: `${namespace}/${baseType}#FAILURE`,
    };
  }
  return {
    PRE_REQUEST: baseType + '#PRE_REQUEST',
    REQUEST: baseType + '#REQUEST',
    SUCCESS: baseType + '#SUCCESS',
    FAILURE: baseType + '#FAILURE'
  };
}

export function isApiType (type: any): type is ApiCallType {
  return type && type.PRE_REQUEST && type.REQUEST && type.SUCCESS && type.FAILURE;
}
