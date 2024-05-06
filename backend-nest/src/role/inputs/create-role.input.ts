import { InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsString()
  @IsNotEmpty()
  name: string;
}
