import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SupertokenModuleConfig } from './types/supertoken.type';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SupertokenModuleConfig>()
    .setClassMethodName('forRoot')
    .build();
