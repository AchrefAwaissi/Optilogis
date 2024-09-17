import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { GeocodingService } from './geocoding.service';
import { Item } from './item.iterface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { Types } from 'mongoose';

// Interface pour l'utilisateur MongoDB
interface User {
  _id: Types.ObjectId;
  // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
}

// Interface étendue pour la requête authentifiée
interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly geocodingService: GeocodingService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() item: Item,
    @Req() req: AuthenticatedRequest,
  ): Promise<Item> {
    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename);
    }
    console.log('Received item with images:', item);

    // Ajout de l'userId à l'item
    item.userId = req.user._id.toString();

    // Géocodage de l'adresse
    const coordinates = await this.geocodingService.getCoordinates(
      item.address,
      item.city,
      item.country,
    );
    if (coordinates) {
      item.latitude = coordinates.lat;
      item.longitude = coordinates.lng;
    }

    return this.itemService.create(item);
  }

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    const item = await this.itemService.findOne(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() item: Item,
    @Req() req: AuthenticatedRequest,
  ): Promise<Item> {
    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename);
    }

    // Vérification que l'utilisateur actuel est le propriétaire de l'item
    const existingItem = await this.itemService.findOne(id);
    if (!existingItem || existingItem.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundException(`Item with ID ${id} not found or you don't have permission to update it`);
    }

    // Géocodage de l'adresse si elle a été modifiée
    if (item.address || item.city || item.country) {
      const coordinates = await this.geocodingService.getCoordinates(
        item.address,
        item.city,
        item.country,
      );
      if (coordinates) {
        item.latitude = coordinates.lat;
        item.longitude = coordinates.lng;
      }
    }

    const updatedItem = await this.itemService.update(id, item);
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return updatedItem;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest): Promise<Item> {
    // Vérification que l'utilisateur actuel est le propriétaire de l'item
    const existingItem = await this.itemService.findOne(id);
    if (!existingItem || existingItem.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundException(`Item with ID ${id} not found or you don't have permission to delete it`);
    }

    const deletedItem = await this.itemService.deleteById(id);
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return deletedItem;
  }
}