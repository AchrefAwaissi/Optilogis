import { 
  Controller, 
  Post, 
  Get,
  Put,
  Delete,
  Body, 
  Param,
  ValidationPipe 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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

  // Nouvelles routes CRUD

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