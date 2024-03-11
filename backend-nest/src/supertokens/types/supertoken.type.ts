import { AppInfo } from 'supertokens-node/types';

export type SupertokenModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
};
