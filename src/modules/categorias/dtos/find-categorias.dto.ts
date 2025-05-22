import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FindCategoriasDto {
  @ApiPropertyOptional({ description: 'Nome da categoria (busca parcial)' })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Limite de registros por página',
    default: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Página atual', default: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page?: number = 1;
}
