import { createMongoAbility, RawRuleOf } from '@casl/ability';
import { AppAbility } from 'src/casl/types/app-ability.type';

export const createAbility = (rules: RawRuleOf<AppAbility>[]) =>
  createMongoAbility<AppAbility>(rules);
