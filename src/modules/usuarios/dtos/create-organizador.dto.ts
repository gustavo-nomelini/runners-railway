import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
import { Transform } from 'class-transformer';

export class CreateOrganizadorDto extends CreateUsuarioDto {
  @ApiProperty({
    example: 'Empresa de Eventos XYZ',
    description: 'Nome da empresa ou organização',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nomeEmpresa: string;

  //Aceitará CNPJs com ou sem formatação
  //Transformará automaticamente o valor para conter apenas números
  //Validará se o formato está correto
  //Armazenará apenas os 14 dígitos numéricos no banco de dados
  @ApiProperty({
    example: '12.345.678/0001-95',
    description: 'CNPJ da empresa ou organização (com ou sem formatação)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/[^\d]/g, ''))
  @Matches(/^(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, {
    message: 'CNPJ deve estar no formato correto e conter 14 dígitos numéricos',
  })
  cnpj: string;


  @ApiProperty({
    example: 'https://empresa.com',
    description: 'URL do site da empresa ou organização',
  })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  site?: string;

}

function Matches(arg0: RegExp, arg1: { message: string; }): (target: CreateOrganizadorDto, propertyKey: "cnpj") => void {
  throw new Error('Function not implemented.');
}

