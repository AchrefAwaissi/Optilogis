import { Test, TestingModule } from '@nestjs/testing';
import { DossierService } from './dossier.service';
import { getModelToken } from '@nestjs/mongoose';
import { Dossier } from './dossier.schema';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('DossierService', () => {
  let service: DossierService;
  let model: Model<Dossier>;

  // Mock data
  const mockUser = { _id: 'user_id' };
  const mockOwner1 = { _id: 'owner1_id' };
  const mockOwner2 = { _id: 'owner2_id' };
  const mockDossier = {
    _id: 'dossier_id',
    dossierFacileUrl: 'https://example.com/dossier',
    userId: mockUser._id,
    owners: [
      { ownerId: mockOwner1._id, isValidated: false },
      { ownerId: mockOwner2._id, isValidated: false }
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DossierService,
        {
          provide: getModelToken(Dossier.name),
          useValue: {
            new: jest.fn().mockReturnValue(mockDossier),
            constructor: jest.fn().mockReturnValue(mockDossier),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DossierService>(DossierService);
    model = module.get<Model<Dossier>>(getModelToken(Dossier.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new dossier', async () => {
      const createDossierDto = {
        dossierFacileUrl: 'https://example.com/dossier',
        ownerIds: [mockOwner1._id, mockOwner2._id],
        userId: mockUser._id, // Added userId here
      };

      (axios.head as jest.Mock).mockResolvedValue({ status: 200 });
      (model.create as jest.Mock).mockResolvedValue(mockDossier);

      const result = await service.create(createDossierDto, mockUser._id);

      expect(result).toEqual(mockDossier);
      expect(model.create).toHaveBeenCalledWith({
        dossierFacileUrl: createDossierDto.dossierFacileUrl,
        userId: mockUser._id,
        owners: expect.arrayContaining([
          expect.objectContaining({ ownerId: mockOwner1._id, isValidated: false }),
          expect.objectContaining({ ownerId: mockOwner2._id, isValidated: false })
        ])
      });
    });

    it('should throw BadRequestException for invalid URL', async () => {
      const createDossierDto = {
        dossierFacileUrl: 'invalid-url',
        ownerIds: [mockOwner1._id],
        userId: mockUser._id, // Added userId here
      };

      (axios.head as jest.Mock).mockRejectedValue(new Error('Invalid URL'));

      await expect(service.create(createDossierDto, mockUser._id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a dossier', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockDossier),
      } as any);

      const result = await service.findOne('dossier_id');
      expect(result).toEqual(mockDossier);
      expect(model.findById).toHaveBeenCalledWith('dossier_id');
    });

    it('should throw NotFoundException when dossier is not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('nonexistent_id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUser', () => {
    it('should return dossiers for a user', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockDossier]),
      } as any);

      const result = await service.findByUser(mockUser._id);
      expect(result).toEqual([mockDossier]);
      expect(model.find).toHaveBeenCalledWith({ userId: mockUser._id });
    });
  });

  describe('findByOwner', () => {
    it('should return dossiers for an owner', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockDossier]),
      } as any);

      const result = await service.findByOwner(mockOwner1._id);
      expect(result).toEqual([mockDossier]);
      expect(model.find).toHaveBeenCalledWith({ 'owners.ownerId': mockOwner1._id });
    });
  });

  describe('validateDossier', () => {
    it('should validate a dossier for an owner', async () => {
      const updatedDossier = { ...mockDossier, owners: [{ ownerId: mockOwner1._id, isValidated: true }, { ownerId: mockOwner2._id, isValidated: false }] };
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedDossier),
      } as any);

      const result = await service.validateDossier('dossier_id', mockOwner1._id);
      expect(result).toEqual(updatedDossier);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'dossier_id', 'owners.ownerId': mockOwner1._id },
        { $set: { 'owners.$.isValidated': true } },
        { new: true }
      );
    });

    it('should throw NotFoundException when dossier is not found or user is not an owner', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.validateDossier('nonexistent_id', 'non_owner_id')).rejects.toThrow(NotFoundException);
    });
  });
});
