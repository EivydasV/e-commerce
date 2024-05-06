import { Catch, ExceptionFilter, ForbiddenException } from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';

@Catch(ForbiddenError)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch() {
    throw new ForbiddenException();
  }
}
