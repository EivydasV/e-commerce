import { Module } from '@nestjs/common';
import { OffsetModule } from './offset/offset.module';

@Module({
  imports: [OffsetModule],
  exports: [OffsetModule],
})
export class PaginationsModule {}
