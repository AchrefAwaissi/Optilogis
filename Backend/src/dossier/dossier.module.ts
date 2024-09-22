import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DossierController } from './dossier.controller';
import { DossierService } from './dossier.service';
import { Dossier, DossierSchema } from './dossier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dossier.name, schema: DossierSchema }]),
  ],
  controllers: [DossierController],
  providers: [DossierService],
  exports: [DossierService],
})
export class DossierModule {}