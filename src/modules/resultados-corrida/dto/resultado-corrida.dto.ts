import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateResultadoCorridaDto {
  @IsNotEmpty()
  @IsNumber()
  eventoId: number;

  @IsString()
  @IsNotEmpty()
  tempoLiquido: string;

  @IsString()
  @IsOptional()
  tempoBruto?: string;

  @IsNumber()
  @IsOptional()
  posicaoGeral?: number | null;

  @IsNumber()
  @IsOptional()
  posicaoCategoria?: number | null;

  @IsString()
  @IsOptional()
  categoriaCorreida?: string | null;

  @IsString()
  @IsOptional()
  ritmoMedio?: string | null;

  @IsNumber()
  @IsOptional()
  velocidadeMedia?: number | null;

  @IsNumber()
  @IsOptional()
  distanciaPercorrida?: number | null;

  @IsString()
  @IsOptional()
  linkCertificado?: string | null;

  @IsString()
  @IsOptional()
  chipId?: string | null;

  @IsObject()
  @IsOptional()
  splits?: Record<string, string> | null;
}

export class UpdateResultadoCorridaDto {
  @IsString()
  @IsOptional()
  tempoLiquido?: string;

  @IsString()
  @IsOptional()
  tempoBruto?: string;

  @IsNumber()
  @IsOptional()
  posicaoGeral?: number | null;

  @IsNumber()
  @IsOptional()
  posicaoCategoria?: number | null;

  @IsString()
  @IsOptional()
  categoriaCorreida?: string | null;

  @IsString()
  @IsOptional()
  ritmoMedio?: string | null;

  @IsNumber()
  @IsOptional()
  velocidadeMedia?: number | null;

  @IsNumber()
  @IsOptional()
  distanciaPercorrida?: number | null;

  @IsString()
  @IsOptional()
  linkCertificado?: string | null;

  @IsBoolean()
  @IsOptional()
  validado?: boolean;

  @IsString()
  @IsOptional()
  fonteDados?: string;

  @IsString()
  @IsOptional()
  chipId?: string | null;

  @IsObject()
  @IsOptional()
  splits?: Record<string, string> | null;
}
