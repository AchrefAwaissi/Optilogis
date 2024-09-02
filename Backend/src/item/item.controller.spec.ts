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
    image: 'apartment.jpg',
    title: 'City Center Apartment',
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
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
    it('should create an item', async () => {
      const mockFile = { filename: 'apartment.jpg' } as Express.Multer.File;
      const mockCoordinates = { lat: 40.7128, lng: -74.0060 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.create.mockResolvedValue(mockItem as Item & Document);

      const result = await controller.create(mockFile, mockItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'USA');
      expect(itemService.create).toHaveBeenCalledWith({
        ...mockItem,
        image: 'apartment.jpg',
        latitude: 40.7128,
        longitude: -74.0060,
      });
      expect(result).toEqual(mockItem);
    });

    it('should create an item without an image', async () => {
      const itemWithoutImage: Partial<Item> = { ...mockItem, image: undefined };
      const mockCoordinates = { lat: 40.7128, lng: -74.0060 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.create.mockResolvedValue(itemWithoutImage as Item & Document);

      const result = await controller.create(undefined, itemWithoutImage as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'USA');
      expect(itemService.create).toHaveBeenCalledWith({
        ...itemWithoutImage,
        latitude: 40.7128,
        longitude: -74.0060,
      });
      expect(result).toEqual(itemWithoutImage);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems: (Item & Document)[] = [
        mockItem as Item & Document,
        { ...mockItem, name: 'Another Apartment' } as Item & Document
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
    it('should update an item', async () => {
      const mockFile = { filename: 'updated.jpg' } as Express.Multer.File;
      const updatedItem: Partial<Item> = { ...mockItem, name: 'Updated Apartment', image: 'updated.jpg' };
      const mockCoordinates = { lat: 40.7129, lng: -74.0061 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.update.mockResolvedValue(updatedItem as Item & Document);

      const result = await controller.update('1', mockFile, updatedItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'USA');
      expect(itemService.update).toHaveBeenCalledWith('1', {
        ...updatedItem,
        latitude: 40.7129,
        longitude: -74.0061,
      });
      expect(result).toEqual(updatedItem);
    });

    it('should update an item without changing the image', async () => {
      const updatedItem: Partial<Item> = { ...mockItem, name: 'Updated Apartment' };
      const mockCoordinates = { lat: 40.7129, lng: -74.0061 };
      
      geocodingService.getCoordinates.mockResolvedValue(mockCoordinates);
      itemService.update.mockResolvedValue(updatedItem as Item & Document);

      const result = await controller.update('1', undefined, updatedItem as Item);

      expect(geocodingService.getCoordinates).toHaveBeenCalledWith('123 Main St', 'New York', 'USA');
      expect(itemService.update).toHaveBeenCalledWith('1', {
        ...updatedItem,
        latitude: 40.7129,
        longitude: -74.0061,
      });
      expect(result).toEqual(updatedItem);
    });

    it('should throw NotFoundException if item to update is not found', async () => {
      itemService.update.mockResolvedValue(null);

      await expect(controller.update('1', null, mockItem as Item)).rejects.toThrow(NotFoundException);
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