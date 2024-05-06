import { ForcedSubject, MongoAbility } from '@casl/ability';
import { ActionEnum } from '../enums/action.enum';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

export type AppAbility = MongoAbility<
  [
    ActionEnum,
    SubjectEnum | ForcedSubject<Exclude<SubjectEnum, SubjectEnum.All>>,
  ]
>;
