import { IsOptional, IsUrl, IsArray, ArrayMinSize, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateDossierDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
  
  @IsOptional()
  @IsUrl({}, { message: 'Le lien DossierFacile doit être une URL valide' })
  dossierFacileUrl?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  ownerIds: string[];
}