import { BaseRepository } from '../../db/repositories/base.repository';
import { User, UserDocument } from '../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OffsetService } from '../../paginations/offset/offset.service';
import { MongooseQuery } from '../../db/types/query.type';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument, User> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    offsetService: OffsetService<UserDocument>,
  ) {
    super(userModel, offsetService);
  }

  findByEmail(email: string): MongooseQuery<UserDocument | null> {
    return this.userModel.findOne({ email });
  }
}
