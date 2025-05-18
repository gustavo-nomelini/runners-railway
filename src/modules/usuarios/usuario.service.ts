import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { NivelPermissao } from '../../core/enums/nivel-permissao.enum';
import { CreateOrganizadorDto } from './dtos/create-organizador.dto';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import {
  EmailAlreadyExistsException,
  UsuarioNotFoundException,
} from './exceptions/usuario.exceptions';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Verifique se o email já existe
    const existingUser = await this.usuarioRepository.findByEmail(
      createUsuarioDto.email,
    );

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    try {
      // Hash da senha
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(createUsuarioDto.senha, 10);
      } catch (hashError) {
        throw new InternalServerErrorException('Erro ao processar senha');
      }

      // Criar usuário
      return await this.usuarioRepository.create({
        nome: createUsuarioDto.nome,
        email: createUsuarioDto.email,
        senhaHash: hashedPassword,
        fotoPerfilUrl: createUsuarioDto.fotoPerfilUrl,
        biografia: createUsuarioDto.biografia,
        cidade: createUsuarioDto.cidade,
        estado: createUsuarioDto.estado,
        pais: createUsuarioDto.pais,
        dataNascimento: createUsuarioDto.dataNascimento,
        genero: createUsuarioDto.genero,
        nivelPermissao: NivelPermissao.USUARIO,
      });
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Erro ao criar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  async createOrganizador(createOrganizadorDto: CreateOrganizadorDto) {
    // Verifique se o email já existe
    const existingUser = await this.usuarioRepository.findByEmail(
      createOrganizadorDto.email,
    );

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    try {
      // Hash da senha
      let hashedPassword: string;
      try {
        hashedPassword = await bcrypt.hash(createOrganizadorDto.senha, 10);
      } catch (hashError) {
        throw new InternalServerErrorException('Erro ao processar senha');
      }

      // Criar organizador
      const organizadorData: Prisma.UsuarioCreateInput = {
        nome: createOrganizadorDto.nome,
        email: createOrganizadorDto.email,
        senhaHash: hashedPassword,
        fotoPerfilUrl: createOrganizadorDto.fotoPerfilUrl,
        biografia: createOrganizadorDto.biografia,
        cidade: createOrganizadorDto.cidade,
        estado: createOrganizadorDto.estado,
        pais: createOrganizadorDto.pais,
        nivelPermissao: NivelPermissao.ORGANIZADOR,
        // Campos específicos do organizador
        nomeEmpresa: createOrganizadorDto.nomeEmpresa,
        cnpj: createOrganizadorDto.cnpj,
        site: createOrganizadorDto.site,
      };

      return await this.usuarioRepository.create(organizadorData);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Erro ao criar organizador: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  async findAll() {
    return this.usuarioRepository.findAll();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UsuarioNotFoundException(id);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // Verificar se o usuário existe
    const existingUser = await this.usuarioRepository.findById(id);

    if (!existingUser) {
      throw new UsuarioNotFoundException(id);
    }

    // Se estiver atualizando o email, verificar se já existe
    if (
      updateUsuarioDto.email &&
      updateUsuarioDto.email !== existingUser.email
    ) {
      const emailExists = await this.usuarioRepository.findByEmail(
        updateUsuarioDto.email,
      );

      if (emailExists) {
        throw new EmailAlreadyExistsException();
      }
    }

    try {
      // Preparar os dados para atualização
      const { senha, ...updateData } = updateUsuarioDto;

      // Se estiver atualizando a senha, fazer o hash
      if (senha) {
        let hashedPassword: string;
        try {
          hashedPassword = await bcrypt.hash(senha, 10);
          // Adicionar senhaHash ao objeto de atualização
          (updateData as any).senhaHash = hashedPassword;
        } catch (hashError) {
          throw new InternalServerErrorException('Erro ao processar senha');
        }
      }

      return this.usuarioRepository.update(
        id,
        updateData as Prisma.UsuarioUpdateInput,
      );
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Erro ao atualizar usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  async remove(id: number) {
    // Verificar se o usuário existe
    const existingUser = await this.usuarioRepository.findById(id);

    if (!existingUser) {
      throw new UsuarioNotFoundException(id);
    }

    await this.usuarioRepository.delete(id);

    return { message: 'Usuário removido com sucesso' };
  }

  async findByEmail(email: string) {
    return this.usuarioRepository.findByEmail(email);
  }

  /**
   * Atualiza o nível de permissão de um usuário
   */
  async atualizarNivelPermissao(id: number, nivelPermissao: NivelPermissao) {
    // Verificar se o usuário existe
    const existingUser = await this.usuarioRepository.findById(id);

    if (!existingUser) {
      throw new UsuarioNotFoundException(id);
    }

    // Verificar se o nível de permissão é válido
    if (
      ![
        NivelPermissao.USUARIO,
        NivelPermissao.ORGANIZADOR,
        NivelPermissao.ADMIN,
      ].includes(nivelPermissao)
    ) {
      throw new BadRequestException('Nível de permissão inválido');
    }

    try {
      return this.usuarioRepository.update(id, {
        nivelPermissao,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao atualizar nível de permissão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
  }

  async updateLastActivity(id: number) {
    return this.usuarioRepository.update(id, {
      ultimaAtividade: new Date(),
    });
  }
}
