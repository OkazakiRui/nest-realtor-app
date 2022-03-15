import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SigninDto, SignupDto, GenerateProductKeyDto } from 'src/dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
