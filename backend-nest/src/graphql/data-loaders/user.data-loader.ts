import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DocId } from 'src/db/types/doc-id.type';
import { UserDocument } from 'src/users/schemas/user.schema';
import { UserRepository } from 'src/users/repositories/user.repository';
import { idsToDocumentsMapper } from 'src/graphql/helpers/ids-to-documents-mapper.helper';

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

    return idsToDocumentsMapper(users, userIds);
  }
}
