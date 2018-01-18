import { RequestType } from './interfaces';

export function getRequestType (baseType: string): RequestType {
  return {
    PRE_REQUEST: baseType + '#PRE_REQUEST',
    REQUEST: baseType + '#REQUEST',
    SUCCESS: baseType + '#SUCCESS',
    FAILURE: baseType + '#FAILURE'
  };
}
