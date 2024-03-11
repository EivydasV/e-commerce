import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetPasswordInput extends PickType(CreateUserInput, [
  'password',
] as const) {
  @IsString()
  @IsNotEmpty()
  forgotPasswordToken: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
