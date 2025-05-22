import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    @Length(1, 50)
    nome: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 100)
    senha: string;
}