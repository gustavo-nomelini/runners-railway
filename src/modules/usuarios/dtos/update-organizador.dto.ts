import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { UpdateUsuarioDto } from './update-usuario.dto';

export class UpdateOrganizadorDto extends UpdateUsuarioDto {
  @ApiProperty({
    example: 'Empresa de Eventos XYZ',
    description: 'Nome da empresa ou organização',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nomeEmpresa?: string;

  @ApiProperty({
    example: '12.345.678/0001-95',
    description: 'CNPJ da empresa ou organização (com ou sem formatação)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value ? value.replace(/[^\d]/g, '') : value))
  @Matches(/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, {
    message: 'CNPJ deve estar no formato correto e conter 14 dígitos numéricos',
  })
  cnpj?: string;

  @ApiProperty({
    example: 'https://empresa.com',
    description: 'URL do site da empresa ou organização',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  site?: string;
}
