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
  UnauthorizedException,
  ForbiddenException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { GeocodingService } from './geocoding.service';
import { Item } from './item.iterface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Interface pour l'utilisateur MongoDB
interface User {
    userId: Types.ObjectId;
    username: string;
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
  @UseGuards(JwtAuthGuard)
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
    console.log('Received request:', req.user);

    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename);
    }
    console.log('Received item with images:', item);

    item.userId = req.user.userId;

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
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async update(
  @Param('id') id: string,
  @UploadedFiles() files: Express.Multer.File[],
  @Body() item: Partial<Item>,
  @Req() req: AuthenticatedRequest,
): Promise<Item> {

  const userId = req.user.userId;
  console.log('User ID from request:', userId);

  try {
    // Vérifier si l'item existe
    const existingItem = await this.itemService.findOne(id);
    if (!existingItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    console.log('Existing item:', JSON.stringify(existingItem, null, 2));

    // Vérifier si l'item a un userId
    if (!existingItem.userId) {
      console.log('Item does not have a userId, assigning current user as owner');
      existingItem.userId = userId;
      await this.itemService.update(id, { userId: userId }, userId.toString());
    } else if (existingItem.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(`You don't have permission to update this item`);
    }

    // Mise à jour des images si de nouveaux fichiers sont téléchargés
    if (files && files.length > 0) {
      item.images = files.map((file) => file.filename);
    }

    // Géocodage si l'adresse est modifiée
    if (item.address || item.city || item.country) {
      const coordinates = await this.geocodingService.getCoordinates(
        item.address || existingItem.address,
        item.city || existingItem.city,
        item.country || existingItem.country,
      );
      if (coordinates) {
        item.latitude = coordinates.lat;
        item.longitude = coordinates.lng;
      }
    }

    // Mise à jour de l'item
    const updatedItem = await this.itemService.update(id, item, userId.toString());
    console.log('Item updated successfully:', updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

@Delete(':id')
@UseGuards(JwtAuthGuard)
async deleteItem(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
  const userId = req.user.userId;
  console.log('User ID from request:', userId);

  try {
    const deletedItem = await this.itemService.deleteById(id, userId.toString());
    if (!deletedItem) {
      throw new NotFoundException(`Item with ID ${id} not found or you don't have permission to delete it`);
    }
    return { message: 'Item deleted successfully' };
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
}

@Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeItem(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId.toString();
    try {
      const updatedItem = await this.itemService.addLike(id, userId);
      return { message: 'Item liked successfully', item: updatedItem };
    } catch (error) {
      console.error('Error liking item:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to like the item');
    }
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  async unlikeItem(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId.toString();
    try {
      const updatedItem = await this.itemService.removeLike(id, userId);
      return { message: 'Item unliked successfully', item: updatedItem };
    } catch (error) {
      console.error('Error unliking item:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnauthorizedException('Unable to unlike the item');
    }
  }
}