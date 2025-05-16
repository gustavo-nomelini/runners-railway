import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { StatusInscricao } from './create-usuario-evento.dto';

export class FindUsuarioEventosDto {
  @ApiPropertyOptional({
    description: 'Página atual',
    example: 1,
    default: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limite de itens por página',
    example: 10,
    default: 10,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'ID do usuário',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  usuarioId?: number;

  @ApiPropertyOptional({
    description: 'ID do evento',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  eventoId?: number;

  @ApiPropertyOptional({
    description: 'Status da inscrição',
    example: 'Inscrito',
    enum: StatusInscricao,
  })
  @IsEnum(StatusInscricao)
  @IsOptional()
  status?: StatusInscricao;
}
