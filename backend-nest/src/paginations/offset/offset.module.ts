import { Module } from '@nestjs/common';
import { OffsetService } from './offset.service';

@Module({
  providers: [OffsetService],
  exports: [OffsetService],
})
export class OffsetModule {}
