import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDossierDto } from './dto/create-dossier.dto';
import axios from 'axios';
import { Dossier } from './dossier.schema';

@Injectable()
export class DossierService {
    constructor(
      @InjectModel(Dossier.name) private DossierModel: Model<Dossier>
    ) {}
  
    async create(createDossierDto: CreateDossierDto, userId: string): Promise<Dossier> {
      console.log('Creating dossier with DTO:', createDossierDto);
      console.log('User ID:', userId);
    
      if (createDossierDto.dossierFacileUrl) {
        await this.validateUrl(createDossierDto.dossierFacileUrl);
      }
      
      const owners = createDossierDto.ownerIds.map(ownerId => ({ ownerId, isValidated: false }));
    
      const dossierData = {
        dossierFacileUrl: createDossierDto.dossierFacileUrl,
        userId,
        owners,
      };
    
      console.log('Dossier data to be created:', dossierData);
    
      try {
        const createdDossier = await this.DossierModel.create(dossierData);
        console.log('Created dossier:', createdDossier);
        return createdDossier;
      } catch (error) {
        console.error('Error creating dossier:', error);
        throw error;
      }
    }
      
  
    async findOne(id: string): Promise<Dossier> {
      const dossier = await this.DossierModel.findById(id).exec();
      if (!dossier) {
        throw new NotFoundException('Dossier non trouvé');
      }
      return dossier;
    }
  
    async findByUser(userId: string): Promise<Dossier[]> {
      return this.DossierModel.find({ userId }).exec();
    }
  
    async findByOwner(ownerId: string): Promise<Dossier[]> {
      return this.DossierModel.find({ 'owners.ownerId': ownerId }).exec();
    }
  
    async validateDossier(id: string, ownerId: string): Promise<Dossier> {
      const dossier = await this.DossierModel.findOneAndUpdate(
        { _id: id, 'owners.ownerId': ownerId },
        { $set: { 'owners.$.isValidated': true } },
        { new: true }
      ).exec();
      if (!dossier) {
        throw new NotFoundException('Dossier non trouvé ou vous n\'êtes pas un propriétaire de ce dossier');
      }
      return dossier;
    }

  private async validateUrl(url: string): Promise<void> {
    if (!this.isValidUrl(url)) {
      throw new BadRequestException('URL invalide');
    }

    try {
      await axios.head(url);
    } catch (error) {
      throw new BadRequestException('URL inaccessible');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}