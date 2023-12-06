import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly AuthService: AuthService){

    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto) {
        return this.AuthService.login(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login/access_token')
    async getNewTokens(@Body() dto: RefreshTokenDto) {
        return this.AuthService.getNewTokens(dto)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('register')
    async register(@Body() dto: AuthDto) {
        return this.AuthService.register(dto)
    }
}
