import { Controller, Get, Query } from '@nestjs/common';
import { FilterService } from './filter.service';
import { Item } from '../item/item.iterface';

@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @Get('price')
  async filterByPrice(
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ): Promise<Item[]> {
    return this.filterService.filterByPrice(minPrice, maxPrice);
  }

  @Get('size')
  async filterBySize(
    @Query('minSize') minSize?: number,
    @Query('maxSize') maxSize?: number,
  ): Promise<Item[]> {
    return this.filterService.filterBySize(minSize, maxSize);
  }

  @Get('typeOfHousing')
  async filterByTypeOfHousing(
    @Query('typeOfHousing') typeOfHousing?: 'maison' | 'appartement' | 'studio',
  ): Promise<Item[]> {
    return this.filterService.filterByPlace(typeOfHousing);
  }
}
