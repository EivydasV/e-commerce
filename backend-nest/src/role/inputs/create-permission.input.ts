import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ActionEnum } from 'src/casl/enums/action.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QueryFilterInput } from 'src/role/inputs/query-filter.input';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@InputType()
export class CreatePermissionInput {
  @IsEnum(ActionEnum)
  @IsNotEmpty()
  action: ActionEnum;

  @IsEnum(SubjectEnum)
  @IsNotEmpty()
  subject: SubjectEnum;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QueryFilterInput)
  @Field(() => [QueryFilterInput], { nullable: true })
  conditions?: QueryFilterInput[];
}

registerEnumType(ActionEnum, {
  name: 'Actions',
});

registerEnumType(SubjectEnum, {
  name: 'Subjects',
});
