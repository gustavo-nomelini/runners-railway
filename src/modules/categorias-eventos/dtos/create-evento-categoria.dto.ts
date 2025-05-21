import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class EventoCategoriaItem {
  @ApiProperty({ description: 'ID do evento' })
  @IsNumber()
  @IsNotEmpty()
  eventoId: number;

  @ApiProperty({ description: 'ID da categoria' })
  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;
}

export class CreateEventoCategoriaDto {
  @ApiProperty({
    description: 'Lista de relações entre eventos e categorias',
    type: [EventoCategoriaItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventoCategoriaItem)
  items: EventoCategoriaItem[];
}

export class AddCategoriaToEventoDto {
  @ApiProperty({
    description: 'ID da categoria para adicionar ao evento',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  categoriaIds: number[];
}

export class AddEventoToCategoriaDto {
  @ApiProperty({
    description: 'ID do evento para adicionar à categoria',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  eventoIds: number[];
}
