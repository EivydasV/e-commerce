import { Injectable } from '@nestjs/common';
import { BaseHashing } from './base.hashing';
import * as argon2 from 'argon2';
@Injectable()
export class ArgonHashing implements BaseHashing {
  async hash(plainText: string | Buffer): Promise<string> {
    return argon2.hash(plainText);
  }

  async compare(
    plainText: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    return argon2.verify(encrypted, plainText);
  }
}
