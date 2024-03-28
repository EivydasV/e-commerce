import { InputType } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class CreateCartInput {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
