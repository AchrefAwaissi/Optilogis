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
    return this.filterService.filterByTypeOfHousing(typeOfHousing);
  }

  @Get('name')
  async filterByName(
    @Query('name') name?: string,
  ): Promise<Item[]> {
    return this.filterService.filterByName(name);
  }

  @Get('title')
  async filterByTitle(
    @Query('title') title?: string,
  ): Promise<Item[]> {
    return this.filterService.filterByTitle(title);
  }

  @Get('address')
  async filterByAddress(
    @Query('address') address?: string,
  ): Promise<Item[]> {
    return this.filterService.filterByAddress(address);
  }

  @Get('city')
  async filterByCity(
    @Query('city') city?: string,
  ): Promise<Item[]> {
    return this.filterService.filterByCity(city);
  }

  @Get('country')
  async filterByCountry(
    @Query('country') country?: string,
  ): Promise<Item[]> {
    return this.filterService.filterByCountry(country);
  }

  @Get('rooms')
  async filterByRooms(
    @Query('minRooms') minRooms?: number,
    @Query('maxRooms') maxRooms?: number,
  ): Promise<Item[]> {
    return this.filterService.filterByRooms(minRooms, maxRooms);
  }

  @Get('bedrooms')
  async filterByBedrooms(
    @Query('minBedrooms') minBedrooms?: number,
    @Query('maxBedrooms') maxBedrooms?: number,
  ): Promise<Item[]> {
    return this.filterService.filterByBedrooms(minBedrooms, maxBedrooms);
  }

  @Get('area')
  async filterByArea(
    @Query('minArea') minArea?: number,
    @Query('maxArea') maxArea?: number,
  ): Promise<Item[]> {
    return this.filterService.filterByArea(minArea, maxArea);
  }
}
