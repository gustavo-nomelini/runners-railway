import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class CreateOrganizadorDto extends CreateUsuarioDto {
  @ApiProperty({
    example: 'Empresa de Eventos XYZ',
    description: 'Nome da empresa ou organização',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeEmpresa: string;

  @ApiProperty({
    example: '12345678901234',
    description: 'CNPJ da empresa ou organização (apenas números)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(14)
  @Transform(({ value }) => value?.replace(/[^\d]/g, ''))
  cnpj: string;

  @ApiProperty({
    required: false,
    example: 'Site da empresa',
    description: 'URL do site da empresa ou organização',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  site?: string;
}
