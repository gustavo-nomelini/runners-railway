import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FindEventosCategoriasDto {
  @ApiPropertyOptional({ description: 'ID do evento' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  eventoId?: number;

  @ApiPropertyOptional({ description: 'ID da categoria' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoriaId?: number;

  @ApiPropertyOptional({
    description: 'Número de registros por página',
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Página atual', default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
}
