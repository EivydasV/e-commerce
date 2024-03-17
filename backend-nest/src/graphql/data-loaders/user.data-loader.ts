import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DocId } from '../../db/types/doc-id.type';
import { UserDocument } from '../../users/schemas/user.schema';
import { UserRepository } from '../../users/repositories/user.repository';

@Injectable({ scope: Scope.REQUEST })
export class UserDataLoader extends DataLoader<DocId, UserDocument> {
  constructor(private readonly userRepository: UserRepository) {
    super((keys) => this.batchLoadFn(keys));
  }

  private async batchLoadFn(
    userIds: readonly DocId[],
  ): Promise<UserDocument[]> {
    const users = await this.userRepository.findAll({
      _id: { $in: userIds },
    });

    // console.log(users);
    const attachUserToId = userIds.map((userId) => {
      return users.find((doc) => doc._id.toString() === userId.toString())!;
    });

    return attachUserToId;
  }
}
