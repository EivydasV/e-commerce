import { InputType } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  page: number = 1;
  perPage: number = 20;
}
