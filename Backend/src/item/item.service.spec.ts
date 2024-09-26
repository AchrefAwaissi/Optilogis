import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';

// Create a mock for ItemModel
const mockItemModel = {
  // Add any necessary mock methods here, for example:
  find: jest.fn().mockReturnValue([]),
  // You can add more methods as required
};

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: 'ItemModel', // or the appropriate token for ItemModel
          useValue: mockItemModel,
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
