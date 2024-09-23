import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item } from './item.iterface';

@Injectable()
export class ItemService {
  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async create(item: Item): Promise<Item> {
    try {
      console.log('Creating new item:', item);
      if (!item.userId) {
        throw new Error('userId is required to create an item');
      }
      const newItem = new this.itemModel(item);
      const savedItem = await newItem.save();
      console.log('Item created successfully:', savedItem);
      return savedItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async findAll(userId?: string): Promise<Item[]> {
    try {
      console.log('Fetching items', userId ? `for user ${userId}` : 'for all users');
      const query = userId ? { userId } : {};
      const items = await this.itemModel.find(query).exec();
      console.log(`Found ${items.length} items`);
      return items;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  }

  async findOne(id: string, userId?: string): Promise<Item> {
    try {
      console.log('Fetching item with id:', id);
      const query = userId ? { _id: id, userId } : { _id: id };
      const item = await this.itemModel.findOne(query).exec();
      if (!item) {
        console.log('Item not found');
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      console.log('Item found:', item);
      return item;
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  async update(id: string, item: Partial<Item>, userId: string): Promise<Item> {
    try {
      console.log('Updating item with id:', id);
      console.log('Update data:', item);
      
      const existingItem = await this.itemModel.findById(id).exec();
      if (!existingItem) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
  
      if (!existingItem.userId) {
        existingItem.userId = new Types.ObjectId(userId);
      } else if (existingItem.userId.toString() !== userId) {
        throw new ForbiddenException(`You don't have permission to update this item`);
      }
  
      const updatedItem = await this.itemModel.findByIdAndUpdate(id, { ...item, userId: existingItem.userId }, { new: true }).exec();
      console.log('Item updated successfully:', updatedItem);
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async deleteById(id: string, userId: string): Promise<Item | null> {
    try {
      console.log('Deleting item with id:', id);
      const deletedItem = await this.itemModel.findOneAndDelete({ _id: id, userId }).exec();
      if (!deletedItem) {
        console.log('Item not found for deletion');
        throw new NotFoundException(`Item with ID ${id} not found or you don't have permission to delete it`);
      }
      console.log('Item deleted successfully:', deletedItem);
      return deletedItem;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async addLike(itemId: string, userId: string): Promise<Item> {
    try {
      console.log(`Adding like for item ${itemId} by user ${userId}`);
      const item = await this.itemModel.findById(itemId);
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      }

      if (!item.likes.includes(new Types.ObjectId(userId).toString())) {
        item.likes.push(new Types.ObjectId(userId).toString());
        await item.save();
        console.log('Like added successfully');
      } else {
        console.log('User has already liked this item');
      }

      return item;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }

  async removeLike(itemId: string, userId: string): Promise<Item> {
    try {
      console.log(`Removing like for item ${itemId} by user ${userId}`);
      const item = await this.itemModel.findById(itemId);
      if (!item) {
        throw new NotFoundException(`Item with ID ${itemId} not found`);
      }
  
      const userIdObj = new Types.ObjectId(userId);
      const index = item.likes.findIndex((id) => {
        if (Types.ObjectId.isValid(id)) {
          return (id as unknown as Types.ObjectId).equals(userIdObj);
        } else {
          return id === userId;
        }
      });
  
      if (index > -1) {
        item.likes.splice(index, 1);
        await item.save();
        console.log('Like removed successfully');
      } else {
        console.log('User has not liked this item');
      }
  
      return item;
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  }
}