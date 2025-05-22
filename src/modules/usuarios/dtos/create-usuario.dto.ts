import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    example: 'joao@exemplo.com',
    description: 'Email único do usuário',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Senha123!',
    description:
      'Mínimo 8 caracteres, precisa conter pelo menos uma letra e um número',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).*$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  senha: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do usuário (com ou sem formatação)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/[^\d]/g, ''))
  @Matches(/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/, {
    message:
      'CPF deve conter 11 dígitos numéricos, podendo incluir pontos e traço',
  })
  cpf: string;

  @ApiProperty({
    required: false,
    example: 'https://exemplo.com/foto.jpg',
    description: 'URL da foto de perfil do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  fotoPerfilUrl?: string;

  @ApiProperty({
    required: false,
    example: 'Entusiasta de corrida, gosto de participar de maratonas.',
    description: 'Texto livre sobre o usuário',
  })
  @IsOptional()
  @IsString()
  biografia?: string;

  @ApiProperty({
    required: false,
    example: 'São Paulo',
    description: 'Cidade do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @ApiProperty({
    required: false,
    example: 'SP',
    description: 'Estado/província do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  estado?: string;

  @ApiProperty({
    required: false,
    example: 'Brasil',
    description: 'País do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  pais?: string;

  @ApiProperty({
    required: false,
    example: '1990-01-01',
    description: 'Data de nascimento do usuário',
  })
  @IsOptional()
  @IsDateString()
  dataNascimento?: string;

  @ApiProperty({
    required: false,
    example: 'Masculino',
    description: 'Gênero do usuário',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  genero?: string;
}
