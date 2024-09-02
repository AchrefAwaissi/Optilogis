import { Module } from '@nestjs/common';
import { DatabaseModule } from './databse.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [DatabaseModule, ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
