import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './item.iterface';

@Injectable()
export class ItemService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async create(item: Item): Promise<Item> {
    console.log('Item data:', item);
    const newItem = new this.itemModel(item);
    return newItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    return this.itemModel.findById(id).exec();
  }

  async update(id: string, item: Item): Promise<Item> {
    return this.itemModel.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async deleteById(id: string): Promise<Item | null> {
    return this.itemModel.findByIdAndDelete(id).exec();
  }
}
