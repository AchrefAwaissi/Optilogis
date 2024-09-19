import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { GeocodingService } from './geocoding.service';
import { NotFoundException } from '@nestjs/common';
import { Types, Document } from 'mongoose';

// Type partiel pour Item
type PartialItem = Partial<Document> & {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  address: string;
  city: string;
  country: string;
  userId: Types.ObjectId;
  images?: string[];
};

describe('ItemController', () => {
  let controller: ItemController;
  let itemService: jest.Mocked<ItemService>;
  let geocodingService: jest.Mocked<GeocodingService>;

  const mockId = new Types.ObjectId('66e9669eea679fab58bd2569');
  const mockUserId = new Types.ObjectId();

  const mockItem: PartialItem = {
    _id: mockId,
    name: 'Test Item',
    description: 'Test Description',
    price: 100,
    address: '123 Test St',
    city: 'Test City',
    country: 'Test Country',
    userId: mockUserId,
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
    $createModifiedPathsSnapshot: jest.fn(),
  };

  const mockUser = {
    _id: mockUserId,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        {
          provide: GeocodingService,
          useValue: {
            getCoordinates: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    itemService = module.get(ItemService);
    geocodingService = module.get(GeocodingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto = { ...mockItem };
      const files = [{ filename: 'test.jpg' }] as Express.Multer.File[];
      const req = { user: mockUser } as any;
  
      geocodingService.getCoordinates.mockResolvedValue({ lat: 0, lng: 0 });
      itemService.create.mockResolvedValue({
        ...mockItem,
        images: ['test.jpg'],
        latitude: 0,
        longitude: 0,
        userId: mockUserId.toHexString(), // Modifier cette ligne
      } as any);
  
      const result = await controller.create(files, createItemDto as any, req);
  
      // Vérifier chaque propriété importante individuellement
      expect(result._id.toString()).toBe(mockItem._id.toString());
      expect(result.name).toBe(mockItem.name);
      expect(result.description).toBe(mockItem.description);
      expect(result.price).toBe(mockItem.price);
      expect(result.address).toBe(mockItem.address);
      expect(result.city).toBe(mockItem.city);
      expect(result.country).toBe(mockItem.country);
      expect(result.userId).toBe(mockUserId.toHexString()); // Modifier cette ligne
      expect(result.images).toEqual(['test.jpg']);
      expect(result.latitude).toBe(0);
      expect(result.longitude).toBe(0);
  
      // Vérifier que la méthode create du service a été appelée avec les bonnes données
      expect(itemService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createItemDto,
          userId: mockUserId.toHexString(), // Modifier cette ligne
          images: ['test.jpg'],
          latitude: 0,
          longitude: 0,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const items = [mockItem];
      itemService.findAll.mockResolvedValue(items as any);

      const result = await controller.findAll();

      expect(result).toEqual(items);
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      itemService.findOne.mockResolvedValue(mockItem as any);

      const result = await controller.findOne(mockId.toString());

      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item is not found', async () => {
      itemService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistentid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item', async () => {
      const updateItemDto = { ...mockItem, name: 'Updated Item' };
      const files = [] as Express.Multer.File[];
      const req = { user: mockUser } as any;

      itemService.findOne.mockResolvedValue(mockItem as any);
      geocodingService.getCoordinates.mockResolvedValue({ lat: 1, lng: 1 });
      itemService.update.mockResolvedValue(updateItemDto as any);

      const result = await controller.update(mockId.toString(), files, updateItemDto as any, req);

      expect(result).toEqual(updateItemDto);
      expect(itemService.update).toHaveBeenCalledWith(mockId.toString(), expect.objectContaining({
        ...updateItemDto,
        latitude: 1,
        longitude: 1,
      }));
    });

    it('should throw NotFoundException if item is not found', async () => {
      const updateItemDto = { ...mockItem };
      const files = [] as Express.Multer.File[];
      const req = { user: mockUser } as any;

      itemService.findOne.mockResolvedValue(null);

      await expect(controller.update('nonexistentid', files, updateItemDto as any, req)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not the owner', async () => {
      const updateItemDto = { ...mockItem };
      const files = [] as Express.Multer.File[];
      const req = { user: { _id: new Types.ObjectId() } } as any;

      itemService.findOne.mockResolvedValue(mockItem as any);

      await expect(controller.update(mockId.toString(), files, updateItemDto as any, req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      const req = { user: mockUser } as any;

      itemService.findOne.mockResolvedValue(mockItem as any);
      itemService.deleteById.mockResolvedValue(mockItem as any);

      const result = await controller.delete(mockId.toString(), req);

      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item is not found', async () => {
      const req = { user: mockUser } as any;

      itemService.findOne.mockResolvedValue(null);

      await expect(controller.delete('nonexistentid', req)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not the owner', async () => {
      const req = { user: { _id: new Types.ObjectId() } } as any;

      itemService.findOne.mockResolvedValue(mockItem as any);

      await expect(controller.delete(mockId.toString(), req)).rejects.toThrow(NotFoundException);
    });
  });
});