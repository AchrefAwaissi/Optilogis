import { Controller, Post, Body, Get, Param, UseGuards, Req, ForbiddenException, Patch, BadRequestException } from '@nestjs/common';
import { DossierService } from './dossier.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UserInterface } from '../auth/user.interface';

@Controller('dossiers')
@UseGuards(JwtAuthGuard)
export class DossierController {
  constructor(private readonly dossierService: DossierService) {}

  @Post()
  async create(@Body() createDossierDto: CreateDossierDto, @Req() req: Request) {
    console.log('Received CreateDossierDto:', createDossierDto);
    console.log('Request user:', req.user);

    const authenticatedUser = req.user as { userId: string, username: string };
    console.log('Authenticated user ID:', authenticatedUser.userId);
    console.log('DTO user ID:', createDossierDto.userId);

    if (authenticatedUser.userId !== createDossierDto.userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à créer un dossier pour cet utilisateur');
    }

    return this.dossierService.create(createDossierDto, authenticatedUser.userId);
  }


  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserInterface;
    const dossier = await this.dossierService.findOne(id);
    if (dossier.userId.toString() !== user._id && 
        !dossier.owners.some(owner => owner.ownerId.toString() === user._id)) {
      throw new ForbiddenException('Vous n\'avez pas la permission d\'accéder à ce dossier');
    }
    return dossier;
  }

  @Get('user/me')
  async findMyDossiers(@Req() req: Request) {
    const user = req.user as UserInterface;
    return this.dossierService.findByUser(user._id);
  }

  @Get('owner/me')
  async findMyOwnedDossiers(@Req() req: Request) {
    const user = req.user as UserInterface;
    return this.dossierService.findByOwner(user._id);
  }

  @Patch(':id/validate')
  async validateDossier(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserInterface;
    return this.dossierService.validateDossier(id, user._id);
  }
}