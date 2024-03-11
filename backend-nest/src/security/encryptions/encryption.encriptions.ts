import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class Encryption {
  createUrlRandomToken(length = 64): string {
    return crypto.randomBytes(length).toString('base64url');
  }
}
