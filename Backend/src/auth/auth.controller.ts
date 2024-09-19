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
  ValidationPipe 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard'; // Assurez-vous d'avoir créé ce guard

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.authService.signIn(
      loginUserDto.username,
      loginUserDto.password,
    );
  }

  // Route pour mettre à jour l'utilisateur actuellement authentifié
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateCurrentUser(
    @Request() req,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return this.authService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.findOne(req.user.userId);
  }

  // Autres routes CRUD existantes

  @Get('users')
  async findAll() {
    return this.authService.findAll();
  }

  @Get('users/:id')
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Put('users/:id')
  async update(
    @Param('id') id: string, 
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return this.authService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}