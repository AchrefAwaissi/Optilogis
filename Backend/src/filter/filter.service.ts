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

  async filterByPlace(placeType?: 'maison' | 'appartement' | 'studio'): Promise<Item[]> {
    const filter: any = {};

    if (placeType) {
      filter['placeType'] = placeType;
    }

    return this.itemModel.find(filter).exec();
  }
}
