export interface RequestType {
  PRE_REQUEST?: string;
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface ApiCallWithConfig {
  requestType?: RequestType;
}

export interface ActionWithPayload<T = any> {
  type: string;
  payload?: T;
}
