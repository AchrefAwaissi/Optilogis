import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterService } from './filter.service';
import { Item } from '../item/item.iterface';

describe('FilterService', () => {
  let service: FilterService;
  let model: Model<Item>;

  const mockItemModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilterService,
        {
          provide: getModelToken('Item'),
          useValue: mockItemModel,
        },
      ],
    }).compile();

    service = module.get<FilterService>(FilterService);
    model = module.get<Model<Item>>(getModelToken('Item'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('filterByPrice', () => {
    it('should call the model with the correct filter for minPrice', async () => {
      const minPrice = 100;
      await service.filterByPrice(minPrice);
      expect(mockItemModel.find).toHaveBeenCalledWith({ price: { $gte: minPrice } });
    });

    it('should call the model with the correct filter for maxPrice', async () => {
      const maxPrice = 500;
      await service.filterByPrice(undefined, maxPrice);
      expect(mockItemModel.find).toHaveBeenCalledWith({ price: { $lte: maxPrice } });
    });

    it('should call the model with the correct filter for both minPrice and maxPrice', async () => {
      const minPrice = 100;
      const maxPrice = 500;
      await service.filterByPrice(minPrice, maxPrice);
      expect(mockItemModel.find).toHaveBeenCalledWith({ price: { $gte: minPrice, $lte: maxPrice } });
    });
  });

  describe('filterBySize', () => {
    it('should call the model with the correct filter for minSize', async () => {
      const minSize = 50;
      await service.filterBySize(minSize);
      expect(mockItemModel.find).toHaveBeenCalledWith({ size: { $gte: minSize } });
    });

    it('should call the model with the correct filter for maxSize', async () => {
      const maxSize = 200;
      await service.filterBySize(undefined, maxSize);
      expect(mockItemModel.find).toHaveBeenCalledWith({ size: { $lte: maxSize } });
    });

    it('should call the model with the correct filter for both minSize and maxSize', async () => {
      const minSize = 50;
      const maxSize = 200;
      await service.filterBySize(minSize, maxSize);
      expect(mockItemModel.find).toHaveBeenCalledWith({ size: { $gte: minSize, $lte: maxSize } });
    });
  });

  describe('filterByPlace', () => {
    it('should call the model with the correct filter for placeType', async () => {
      const placeType = 'maison';
      await service.filterByPlace(placeType);
      expect(mockItemModel.find).toHaveBeenCalledWith({ placeType });
    });

    it('should handle other placeTypes correctly', async () => {
      const placeType = 'appartement';
      await service.filterByPlace(placeType);
      expect(mockItemModel.find).toHaveBeenCalledWith({ placeType });
    });
  });
});
