import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(3000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  manufacturer: string;
}
