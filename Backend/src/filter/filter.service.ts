import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../item/item.iterface';

@Injectable()
export class FilterService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async filterByPrice(minPrice?: number, maxPrice?: number): Promise<Item[]> {
    const filter: any = {};

    if (minPrice !== undefined) {
      filter['price'] = { $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      filter['price'] = { ...filter['price'], $lte: maxPrice };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterBySize(minSize?: number, maxSize?: number): Promise<Item[]> {
    const filter: any = {};

    if (minSize !== undefined) {
      filter['size'] = { $gte: minSize };
    }
    if (maxSize !== undefined) {
      filter['size'] = { ...filter['size'], $lte: maxSize };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByTypeOfHousing(typeOfHousing?: 'maison' | 'appartement' | 'studio'): Promise<Item[]> {
    const filter: any = {};

    if (typeOfHousing) {
      filter['typeOfHousing'] = typeOfHousing;
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByName(name?: string): Promise<Item[]> {
    const filter: any = {};

    if (name) {
      filter['name'] = { $regex: new RegExp(name, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByTitle(title?: string): Promise<Item[]> {
    const filter: any = {};

    if (title) {
      filter['title'] = { $regex: new RegExp(title, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByAddress(address?: string): Promise<Item[]> {
    const filter: any = {};

    if (address) {
      filter['address'] = { $regex: new RegExp(address, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByCity(city?: string): Promise<Item[]> {
    const filter: any = {};

    if (city) {
      filter['city'] = { $regex: new RegExp(city, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByCountry(country?: string): Promise<Item[]> {
    const filter: any = {};

    if (country) {
      filter['country'] = { $regex: new RegExp(country, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByRooms(minRooms?: number, maxRooms?: number): Promise<Item[]> {
    const filter: any = {};

    if (minRooms !== undefined) {
      filter['rooms'] = { $gte: minRooms };
    }
    if (maxRooms !== undefined) {
      filter['rooms'] = { ...filter['rooms'], $lte: maxRooms };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByBedrooms(minBedrooms?: number, maxBedrooms?: number): Promise<Item[]> {
    const filter: any = {};

    if (minBedrooms !== undefined) {
      filter['bedrooms'] = { $gte: minBedrooms };
    }
    if (maxBedrooms !== undefined) {
      filter['bedrooms'] = { ...filter['bedrooms'], $lte: maxBedrooms };
    }

    return this.itemModel.find(filter).exec();
  }

  async filterByArea(minArea?: number, maxArea?: number): Promise<Item[]> {
    const filter: any = {};

    if (minArea !== undefined) {
      filter['area'] = { $gte: minArea };
    }
    if (maxArea !== undefined) {
      filter['area'] = { ...filter['area'], $lte: maxArea };
    }

    return this.itemModel.find(filter).exec();
  }

  
  async filterByExposure(exposure?: string): Promise<Item[]> {
    const filter: any = {};

    if (exposure) {
      filter['exposure'] = { $regex: new RegExp(exposure, 'i') };
    }

    return this.itemModel.find(filter).exec();
  }

  
  async filterByFurnished(furnished?: boolean): Promise<Item[]> {
    const filter: any = {};

    if (furnished !== undefined) {
      filter['furnished'] = furnished;
    }

    return this.itemModel.find(filter).exec();
  }
  
  async filterByAccessibility(accessibility?: boolean): Promise<Item[]> {
    const filter: any = {};

    if (accessibility !== undefined) {
      filter['accessibility'] = accessibility;
    }

    return this.itemModel.find(filter).exec();
  }
}
