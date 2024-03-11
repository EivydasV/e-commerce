import { InputType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PickType(CreateUserInput, [
  'email',
  'firstName',
  'lastName',
] as const) {}
