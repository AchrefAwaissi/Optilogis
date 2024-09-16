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
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { GeocodingService } from './geocoding.service';
import { Item } from './item.iterface';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly geocodingService: GeocodingService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, { // Accepte jusqu'à 10 images
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
    @UploadedFiles() files: Express.Multer.File[], // Plusieurs fichiers
    @Body() item: Item,
  ): Promise<Item> {
    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename); // Stocke plusieurs images
    }
    console.log('Received item with images:', item);

    // Géocodage de l'adresse
    const coordinates = await this.geocodingService.getCoordinates(
      item.address,
      item.city,
      'France',
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
    FilesInterceptor('images', 10, { // Accepte jusqu'à 10 images pour la mise à jour
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
    @UploadedFiles() files: Express.Multer.File[], // Plusieurs fichiers
    @Body() item: Item,
  ): Promise<Item> {
    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename); // Met à jour les images
    }

    // Géocodage de l'adresse si elle a été modifiée
    if (item.address || item.city) {
      const coordinates = await this.geocodingService.getCoordinates(
        item.address,
        item.city,
        'France',
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
  async delete(@Param('id') id: string): Promise<Item> {
    const deletedItem = await this.itemService.deleteById(id);
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return deletedItem;
  }
}
