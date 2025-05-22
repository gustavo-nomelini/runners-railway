import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria' })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiPropertyOptional({ description: 'Distância da categoria em km' })
  @IsDecimal({ decimal_digits: '0,2' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseFloat(value) : undefined))
  distancia?: number;

  @ApiPropertyOptional({ description: 'URL do ícone da categoria' })
  @IsString()
  @IsOptional()
  iconeUrl?: string;
}
