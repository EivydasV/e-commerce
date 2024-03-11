import { Module } from '@nestjs/common';
import { BaseHashing } from './hashings/base.hashing';
import { ArgonHashing } from './hashings/argon.hashing';
import { Encryption } from './encryptions/encryption.encriptions';

@Module({
  providers: [
    {
      provide: BaseHashing,
      useClass: ArgonHashing,
    },
    Encryption,
  ],
  exports: [BaseHashing, Encryption],
})
export class SecurityModule {}
