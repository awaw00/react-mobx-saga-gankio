export interface RequestType {
  PRE_REQUEST?: string;
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface ApiTypeConfig {
  requestType?: RequestType;
  receiverKey?: string;
}

export interface ActionWithPayload {
  type: string;
  payload?: {[name: string]: any};
}
