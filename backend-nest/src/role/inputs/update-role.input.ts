import { CreateRoleInput } from 'src/role/inputs/create-role.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {}
