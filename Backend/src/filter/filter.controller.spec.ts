import { Test, TestingModule } from '@nestjs/testing';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';
import { getModelToken } from '@nestjs/mongoose'; // Import getModelToken for Mongoose
import { Model } from 'mongoose';

describe('FilterController', () => {
  let controller: FilterController;
  let service: FilterService;

  beforeEach(async () => {
    const mockItemModel = {
      find: jest.fn().mockResolvedValue([]), // Mock of the find method
      findOne: jest.fn().mockResolvedValue(null), // Mock of the findOne method
      // Add other mocked methods as necessary
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilterController],
      providers: [
        FilterService,
        {
          provide: getModelToken('Item'), // Ensure 'Item' corresponds to your model's name
          useValue: mockItemModel, // Use the mocked model
        },
      ],
    }).compile();

    controller = module.get<FilterController>(FilterController);
    service = module.get<FilterService>(FilterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests as necessary
});
