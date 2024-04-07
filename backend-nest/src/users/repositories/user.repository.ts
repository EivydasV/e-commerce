import { User, UserDocument } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQuery } from '../../db/types/query.type';
import { PageableRepository } from '../../db/repositories/pageable.repository';

@Injectable()
export class UserRepository extends PageableRepository<User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly eventEmitter: EventEmitter,
  ) {
    super(userModel, 'user', eventEmitter);
  }

  findByEmail(email: string): MongooseQuery<UserDocument | null> {
    return this.userModel.findOne({ email });
  }
}
