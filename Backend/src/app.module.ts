import { Module } from '@nestjs/common';
import { DatabaseModule } from './databse.module';
import { ItemModule } from './item/item.module';
import { FilterModule } from './filter/filter.module';
import { AuthModule } from './auth/auth.module';
import { DossierModule } from './dossier/dossier.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    DatabaseModule,
    ItemModule,
    FilterModule,
    AuthModule,
    DossierModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
