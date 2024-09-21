import { Module } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { DossierController } from './dossier.controller';

@Module({
  providers: [DossierService],
  controllers: [DossierController]
})
export class DossierModule {}
