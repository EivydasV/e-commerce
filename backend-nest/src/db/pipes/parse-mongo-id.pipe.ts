import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    const isValidId = Types.ObjectId.isValid(value);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID');
    }

    return value;
  }
}
