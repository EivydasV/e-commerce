import { InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @IsString()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(255)
  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @MaxLength(255)
  lastName: string;
}
