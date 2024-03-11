import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  databaseURL: process.env.DATABASE_URL || '',
}));
