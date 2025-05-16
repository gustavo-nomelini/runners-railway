import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionResponse } from '../filters/http-exception.filter';
import { CustomLoggerService } from '../logger/custom-logger.service';
import { ThrottleStrict } from '../throttler/throttler.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

interface UserResponse {
  id: number;
  nome: string;
  email: string;
  nivelPermissao: number;
  fotoPerfilUrl?: string;
  ativo: boolean;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    nivelPermissao: number;
    fotoPerfilUrl?: string | null;
  };
}

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('AuthController');
  }

  @Post('login')
  @ThrottleStrict()
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({
    status: 200,
    description: 'Retorna token de acesso JWT e dados básicos do usuário',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            nome: { type: 'string' },
            email: { type: 'string' },
            nivelPermissao: { type: 'number' },
            fotoPerfilUrl: { type: 'string', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    type: HttpExceptionResponse,
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.authService.validateUser(
        loginDto.email,
        loginDto.senha,
      );

      if (!user) {
        this.logger.warn(
          `Tentativa de login falhou para o email: ${loginDto.email}`,
        );
        throw new UnauthorizedException('Credenciais inválidas');
      }

      this.logger.log(`Usuário autenticado com sucesso: ${user.email}`);
      return this.authService.login(user);
    } catch (error: unknown) {
      // Log do erro usando a mensagem do erro
      this.logger.error(
        `Erro durante autenticação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
