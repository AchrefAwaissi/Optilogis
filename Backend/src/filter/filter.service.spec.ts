import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterService } from './filter.service';
import { Item } from '../item/item.iterface'; // Ensure this path and filename are correct

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

  // Filter by price
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

  // Filter by size
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

  // Filter by type of housing
  describe('filterByTypeOfHousing', () => {
    it('should call the model with the correct filter for typeOfHousing', async () => {
      const typeOfHousing = 'maison';
      await service.filterByTypeOfHousing(typeOfHousing);
      expect(mockItemModel.find).toHaveBeenCalledWith({ typeOfHousing });
    });

    it('should handle other typeOfHousing values correctly', async () => {
      const typeOfHousing = 'appartement';
      await service.filterByTypeOfHousing(typeOfHousing);
      expect(mockItemModel.find).toHaveBeenCalledWith({ typeOfHousing });
    });

    it('should handle another typeOfHousing value correctly', async () => {
      const typeOfHousing = 'studio';
      await service.filterByTypeOfHousing(typeOfHousing);
      expect(mockItemModel.find).toHaveBeenCalledWith({ typeOfHousing });
    });
  });

  // Filter by name
  describe('filterByName', () => {
    it('should call the model with the correct filter for name', async () => {
      const name = 'TestName';
      await service.filterByName(name);
      expect(mockItemModel.find).toHaveBeenCalledWith({ name: { $regex: new RegExp(name, 'i') } });
    });
  });

  // Filter by title
  describe('filterByTitle', () => {
    it('should call the model with the correct filter for title', async () => {
      const title = 'TestTitle';
      await service.filterByTitle(title);
      expect(mockItemModel.find).toHaveBeenCalledWith({ title: { $regex: new RegExp(title, 'i') } });
    });
  });

  // Filter by address
  describe('filterByAddress', () => {
    it('should call the model with the correct filter for address', async () => {
      const address = '123 Main St';
      await service.filterByAddress(address);
      expect(mockItemModel.find).toHaveBeenCalledWith({ address: { $regex: new RegExp(address, 'i') } });
    });
  });

  // Filter by city
  describe('filterByCity', () => {
    it('should call the model with the correct filter for city', async () => {
      const city = 'Paris';
      await service.filterByCity(city);
      expect(mockItemModel.find).toHaveBeenCalledWith({ city: { $regex: new RegExp(city, 'i') } });
    });
  });

  // Filter by country
  describe('filterByCountry', () => {
    it('should call the model with the correct filter for country', async () => {
      const country = 'USA';
      await service.filterByCountry(country);
      expect(mockItemModel.find).toHaveBeenCalledWith({ country: { $regex: new RegExp(country, 'i') } });
    });
  });

  // Filter by rooms
  describe('filterByRooms', () => {
    it('should call the model with the correct filter for minRooms', async () => {
      const minRooms = 2;
      await service.filterByRooms(minRooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ rooms: { $gte: minRooms } });
    });

    it('should call the model with the correct filter for maxRooms', async () => {
      const maxRooms = 5;
      await service.filterByRooms(undefined, maxRooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ rooms: { $lte: maxRooms } });
    });

    it('should call the model with the correct filter for both minRooms and maxRooms', async () => {
      const minRooms = 2;
      const maxRooms = 5;
      await service.filterByRooms(minRooms, maxRooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ rooms: { $gte: minRooms, $lte: maxRooms } });
    });
  });

  // Filter by bedrooms
  describe('filterByBedrooms', () => {
    it('should call the model with the correct filter for minBedrooms', async () => {
      const minBedrooms = 1;
      await service.filterByBedrooms(minBedrooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ bedrooms: { $gte: minBedrooms } });
    });

    it('should call the model with the correct filter for maxBedrooms', async () => {
      const maxBedrooms = 3;
      await service.filterByBedrooms(undefined, maxBedrooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ bedrooms: { $lte: maxBedrooms } });
    });

    it('should call the model with the correct filter for both minBedrooms and maxBedrooms', async () => {
      const minBedrooms = 1;
      const maxBedrooms = 3;
      await service.filterByBedrooms(minBedrooms, maxBedrooms);
      expect(mockItemModel.find).toHaveBeenCalledWith({ bedrooms: { $gte: minBedrooms, $lte: maxBedrooms } });
    });
  });

   // Filter by area
  describe('filterByArea', () => {
    it('should call the model with the correct filter for minArea', async () => {
      const minArea = 20;
      await service.filterByArea(minArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ area: { $gte: minArea } });
    });

    it('should call the model with the correct filter for maxArea', async () => {
      const maxArea = 100;
      await service.filterByArea(undefined, maxArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ area: { $lte: maxArea } });
    });

    it('should call the model with the correct filter for both minArea and maxArea', async () => {
      const minArea = 20;
      const maxArea = 100;
      await service.filterByArea(minArea, maxArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ area: { $gte: minArea, $lte: maxArea } });
    });
  });

  // Filter by furnished
  describe('filterByFurnished', () => {
    it('should call the model with the correct filter for furnished', async () => {
      const furnished = true;
      await service.filterByFurnished(furnished);
      expect(mockItemModel.find).toHaveBeenCalledWith({ furnished });
    });

    it('should call the model with the correct filter for unfurnished', async () => {
      const furnished = false;
      await service.filterByFurnished(furnished);
      expect(mockItemModel.find).toHaveBeenCalledWith({ furnished });
    });
  });

  // Filter by accessibility
  describe('filterByAccessibility', () => {
    it('should call the model with the correct filter for accessibility', async () => {
      const accessibility = true;
      await service.filterByAccessibility(accessibility);
      expect(mockItemModel.find).toHaveBeenCalledWith({ accessibility });
    });

    it('should call the model with the correct filter for no accessibility', async () => {
      const accessibility = false;
      await service.filterByAccessibility(accessibility);
      expect(mockItemModel.find).toHaveBeenCalledWith({ accessibility });
    });
  });

  // Filter by floor
  describe('filterByFloor', () => {
    it('should call the model with the correct filter for minFloor', async () => {
      const minFloor = 1;
      await service.filterByFloor(minFloor);
      expect(mockItemModel.find).toHaveBeenCalledWith({ floor: { $gte: minFloor } });
    });

    it('should call the model with the correct filter for maxFloor', async () => {
      const maxFloor = 10;
      await service.filterByFloor(undefined, maxFloor);
      expect(mockItemModel.find).toHaveBeenCalledWith({ floor: { $lte: maxFloor } });
    });

    it('should call the model with the correct filter for both minFloor and maxFloor', async () => {
      const minFloor = 1;
      const maxFloor = 10;
      await service.filterByFloor(minFloor, maxFloor);
      expect(mockItemModel.find).toHaveBeenCalledWith({ floor: { $gte: minFloor, $lte: maxFloor } });
    });
  });

  // Filter by annex area
  describe('filterByAnnexArea', () => {
    it('should call the model with the correct filter for minAnnexArea', async () => {
      const minAnnexArea = 5;
      await service.filterByAnnexArea(minAnnexArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ annexArea: { $gte: minAnnexArea } });
    });

    it('should call the model with the correct filter for maxAnnexArea', async () => {
      const maxAnnexArea = 50;
      await service.filterByAnnexArea(undefined, maxAnnexArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ annexArea: { $lte: maxAnnexArea } });
    });

    it('should call the model with the correct filter for both minAnnexArea and maxAnnexArea', async () => {
      const minAnnexArea = 5;
      const maxAnnexArea = 50;
      await service.filterByAnnexArea(minAnnexArea, maxAnnexArea);
      expect(mockItemModel.find).toHaveBeenCalledWith({ annexArea: { $gte: minAnnexArea, $lte: maxAnnexArea } });
    });
  });
});