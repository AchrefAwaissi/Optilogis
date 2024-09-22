import { Test, TestingModule } from '@nestjs/testing';
import { DossierController } from './dossier.controller';
import { DossierService } from './dossier.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { ForbiddenException } from '@nestjs/common';

describe('DossierController', () => {
  let controller: DossierController;
  let service: DossierService;

  const mockUser = { _id: 'user_id', username: 'testuser', email: 'test@example.com' };
  const mockOwner = { _id: 'owner_id', username: 'owneruser', email: 'owner@example.com' };
  const mockDossier = {
    _id: 'dossier_id',
    dossierFacileUrl: 'https://example.com/dossier',
    userId: mockUser._id,
    owners: [{ ownerId: mockOwner._id, isValidated: false }],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DossierController],
      providers: [
        {
          provide: DossierService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockDossier),
            findOne: jest.fn().mockResolvedValue(mockDossier),
            findByUser: jest.fn().mockResolvedValue([mockDossier]),
            findByOwner: jest.fn().mockResolvedValue([mockDossier]),
            validateDossier: jest.fn().mockResolvedValue(mockDossier),
          },
        },
      ],
    }).compile();

    controller = module.get<DossierController>(DossierController);
    service = module.get<DossierService>(DossierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new dossier', async () => {
      const createDossierDto: CreateDossierDto = {
        dossierFacileUrl: 'https://example.com/dossier',
        ownerIds: [mockOwner._id],
      };
      const req = { user: mockUser };

      expect(await controller.create(createDossierDto, req as any)).toEqual(mockDossier);
      expect(service.create).toHaveBeenCalledWith(createDossierDto, mockUser._id);
    });
  });

  describe('findOne', () => {
    it('should return a dossier for the owner', async () => {
      const req = { user: mockOwner };
      expect(await controller.findOne('dossier_id', req as any)).toEqual(mockDossier);
      expect(service.findOne).toHaveBeenCalledWith('dossier_id');
    });

    it('should return a dossier for the user who created it', async () => {
      const req = { user: mockUser };
      expect(await controller.findOne('dossier_id', req as any)).toEqual(mockDossier);
      expect(service.findOne).toHaveBeenCalledWith('dossier_id');
    });

    it('should throw ForbiddenException for unauthorized access', async () => {
      const unauthorizedUser = { _id: 'unauthorized_id', username: 'unauthorized', email: 'unauthorized@example.com' };
      const req = { user: unauthorizedUser };
      await expect(controller.findOne('dossier_id', req as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findMyDossiers', () => {
    it('should return dossiers for the user', async () => {
      const req = { user: mockUser };
      expect(await controller.findMyDossiers(req as any)).toEqual([mockDossier]);
      expect(service.findByUser).toHaveBeenCalledWith(mockUser._id);
    });
  });

  describe('findMyOwnedDossiers', () => {
    it('should return dossiers for the owner', async () => {
      const req = { user: mockOwner };
      expect(await controller.findMyOwnedDossiers(req as any)).toEqual([mockDossier]);
      expect(service.findByOwner).toHaveBeenCalledWith(mockOwner._id);
    });
  });

  describe('validateDossier', () => {
    it('should validate a dossier', async () => {
      const req = { user: mockOwner };
      expect(await controller.validateDossier('dossier_id', req as any)).toEqual(mockDossier);
      expect(service.validateDossier).toHaveBeenCalledWith('dossier_id', mockOwner._id);
    });
  });
});