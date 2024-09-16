import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { GeocodingService } from './geocoding.service';
import { NotFoundException } from '@nestjs/common';
import { Item } from './item.iterface'; // Adjust the import path as necessary
import { Document } from 'mongoose';

describe('ItemController', () => {
  let controller: ItemController;
  let itemService: jest.Mocked<ItemService>;
  let geocodingService: jest.Mocked<GeocodingService>;

  const mockItem: Partial<Item> = {
    name: 'Cozy Apartment',
    description: 'A beautiful apartment in the city center',
    price: 1000,
    images: ['apartment1.jpg', 'apartment2.jpg'], // Multiple images
    title: 'City Center Apartment',
    address: '123 Main St',
    city: 'New York',
    country: 'France',
    typeOfHousing: 'Apartment',
    rooms: 3,
    bedrooms: 2,
    area: 80,
    latitude: 40.7128,
    longitude: -74.0060,
  };

  beforeEach(async () => {
    const mockItemService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
    };

    const mockGeocodingService = {
      getCoordinates: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: GeocodingService, useValue: mockGeocodingService },
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
    it('should create an item with multiple images', async () => {
      const mockFiles = [
        { filename: 'apartment1.jpg' } as Express.Multer.File,
        { filename: 'apartment2.jpg' } as Express.Multer.File,
      ];
      const mockCoordinates = { lat: 40.7128, lng: -74.0060 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.create.mockResolvedValue(mockItem as Item & Document);

      const result = await controller.create(mockFiles, mockItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'France');
      expect(itemService.create).toHaveBeenCalledWith({
        ...mockItem,
        images: ['apartment1.jpg', 'apartment2.jpg'], // Vérification des images
        latitude: 40.7128,
        longitude: -74.0060,
      });
      expect(result).toEqual(mockItem);
    });

    it('should create an item without images', async () => {
      const itemWithoutImages: Partial<Item> = { ...mockItem, images: undefined };
      const mockCoordinates = { lat: 40.7128, lng: -74.0060 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.create.mockResolvedValue(itemWithoutImages as Item & Document);

      const result = await controller.create([], itemWithoutImages as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'France');
      expect(itemService.create).toHaveBeenCalledWith({
        ...itemWithoutImages,
        latitude: 40.7128,
        longitude: -74.0060,
      });
      expect(result).toEqual(itemWithoutImages);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems: (Item & Document)[] = [
        mockItem as Item & Document,
        { ...mockItem, name: 'Another Apartment' } as Item & Document,
      ];
      itemService.findAll.mockResolvedValue(mockItems);

      const result = await controller.findAll();

      expect(itemService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockItems);
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      itemService.findOne.mockResolvedValue(mockItem as Item & Document);

      const result = await controller.findOne('1');

      expect(itemService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item is not found', async () => {
      itemService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an item with new images', async () => {
      const mockFiles = [
        { filename: 'updated1.jpg' } as Express.Multer.File,
        { filename: 'updated2.jpg' } as Express.Multer.File,
      ];
      const updatedItem: Partial<Item> = { ...mockItem, name: 'Updated Apartment', images: ['updated1.jpg', 'updated2.jpg'] };
      const mockCoordinates = { lat: 40.7129, lng: -74.0061 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.update.mockResolvedValue(updatedItem as Item & Document);

      const result = await controller.update('1', mockFiles, updatedItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'France');
      expect(itemService.update).toHaveBeenCalledWith('1', {
        ...updatedItem,
        latitude: 40.7129,
        longitude: -74.0061,
      });
      expect(result).toEqual(updatedItem);
    });

    it('should update an item without changing images', async () => {
      const updatedItem: Partial<Item> = { ...mockItem, name: 'Updated Apartment' };
      const mockCoordinates = { lat: 40.7129, lng: -74.0061 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.update.mockResolvedValue(updatedItem as Item & Document);

      const result = await controller.update('1', [], updatedItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'France');
      expect(itemService.update).toHaveBeenCalledWith('1', {
        ...updatedItem,
        latitude: 40.7129,
        longitude: -74.0061,
      });
      expect(result).toEqual(updatedItem);
    });

    it('should throw NotFoundException if item to update is not found', async () => {
      itemService.update.mockResolvedValue(null);

      await expect(controller.update('1', [], mockItem as Item)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an item', async () => {
      itemService.deleteById.mockResolvedValue(mockItem as Item & Document);

      const result = await controller.delete('1');

      expect(itemService.deleteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockItem);
    });

    it('should throw NotFoundException if item to delete is not found', async () => {
      itemService.deleteById.mockResolvedValue(null);

      await expect(controller.delete('1')).rejects.toThrow(NotFoundException);
    });
  });
});