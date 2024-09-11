import { Module } from '@nestjs/common';
import { DatabaseModule } from './databse.module';
import { ItemModule } from './item/item.module';
import { FilterModule } from './filter/filter.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, ItemModule, FilterModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
