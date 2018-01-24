export interface ApiCallType {
  PRE_REQUEST?: string;
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface ApiCallWithConfig {
  apiCallTypeName?: string;
}

export interface ActionWithPayload<T = any> {
  type: string;
  payload?: T;
}
