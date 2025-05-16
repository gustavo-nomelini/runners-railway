import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject } from 'class-validator';

export class PaginationMeta {
  @ApiProperty({
    description: 'Total de registros',
    example: 100,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Limite de itens por página',
    example: 10,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  @IsNumber()
  totalPages: number;
}

export class UsuarioEventoPaginationResponse<T> {
  @ApiProperty({
    description: 'Lista de registros',
    isArray: true,
  })
  @IsArray()
  data: T[];

  @ApiProperty({
    description: 'Informações de paginação',
    type: PaginationMeta,
  })
  @IsObject()
  meta: PaginationMeta;
}
