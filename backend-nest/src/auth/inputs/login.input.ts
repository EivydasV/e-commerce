import { IsString } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
