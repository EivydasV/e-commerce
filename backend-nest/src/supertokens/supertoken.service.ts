import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import supertokenConfig from './config/supertoken.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SupertokenService {
  constructor(
    @Inject(supertokenConfig.KEY)
    supertoken: ConfigType<typeof supertokenConfig>,
  ) {
    supertokens.init({
      appInfo: supertoken.appInfo,
      supertokens: {
        connectionURI: supertoken.connectionURI,
      },
      recipeList: [
        Session.init({
          getTokenTransferMethod: () => 'cookie',
        }),
      ],
    });
  }
}
