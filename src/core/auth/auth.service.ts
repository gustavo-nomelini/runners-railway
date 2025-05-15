import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomLoggerService } from '../logger/custom-logger.service';

interface UserResponse {
  id: number;
  nome: string;
  email: string;
  nivelPermissao: number;
  fotoPerfilUrl?: string | null;
  ativo: boolean;
}

interface JwtPayload {
  sub: number;
  email: string;
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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    this.logger.debug(`Tentativa de validação do usuário: ${email}`);

    const user = await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
        fotoPerfilUrl: true,
        nivelPermissao: true,
        ativo: true,
      },
    });

    if (!user || !user.ativo) {
      this.logger.debug(`Usuário não encontrado ou inativo: ${email}`);
      return null;
    }

    const isPasswordValid = await this.comparePasswords(
      password,
      user.senhaHash,
    );

    if (!isPasswordValid) {
      this.logger.debug(`Senha inválida para o usuário: ${email}`);
      return null;
    }

    this.logger.debug(`Usuário validado com sucesso: ${email}`);

    // Atualiza a última atividade do usuário
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { ultimaAtividade: new Date() },
    });

    // Remove a senha hash antes de retornar
    const { senhaHash, ...result } = user;
    return result;
  }

  async login(user: UserResponse): Promise<LoginResponse> {
    this.logger.debug(`Gerando token JWT para o usuário: ${user.email}`);

    const payload: JwtPayload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);
    this.logger.debug(`Token JWT gerado com sucesso para: ${user.email}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        nivelPermissao: user.nivelPermissao,
        fotoPerfilUrl: user.fotoPerfilUrl,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
