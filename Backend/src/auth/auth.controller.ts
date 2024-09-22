import { 
  Controller, 
  Post, 
  Get,
  Put,
  Delete,
  Body, 
  Param,
  UseGuards,
  Request,
  ValidationPipe,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profilePhoto', {
    storage: diskStorage({
      destination: './uploads/profile-photos',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB
    }
  }))
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      createUserDto.profilePhotoPath = file.path;
    }
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.signIn(
      loginUserDto.username,
      loginUserDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @UseInterceptors(FileInterceptor('profilePhoto', {
    storage: diskStorage({
      destination: './uploads/profile-photos',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB
    }
  }))
  async updateCurrentUser(
    @Request() req,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      updateUserDto.profilePhotoPath = file.path;
    }
    return this.authService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.findOne(req.user.userId);
  }

  @Get('users')
  async findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Put('users/:id')
  @UseInterceptors(FileInterceptor('profilePhoto', {
    storage: diskStorage({
      destination: './uploads/profile-photos',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB
    }
  }))
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) {
      updateUserDto.profilePhotoPath = file.path;
    }
    return this.authService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}