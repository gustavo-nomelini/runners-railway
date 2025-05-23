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
import { APP_CONSTANTS } from '../../shared/constants/app.constants';
@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  /**
   * Valida a senha de acordo com os requisitos:
   * - Mínimo 8 caracteres
   * - Pelo menos uma letra minúscula
   * - Pelo menos uma letra maiúscula
   * - Pelo menos um número
   * - Pelo menos um caractere especial
   */
  private validatePassword(password: string): {
    isValid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'A senha deve ter pelo menos 8 caracteres',
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos uma letra minúscula',
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos uma letra maiúscula',
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos um número',
      };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos um caractere especial',
      };
    }

    return { isValid: true };
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Validação de senha
    const passwordValidation = this.validatePassword(createUsuarioDto.senha);
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.message);
    }

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
    // Validação de senha
    const passwordValidation = this.validatePassword(
      createOrganizadorDto.senha,
    );
    if (!passwordValidation.isValid) {
      throw new BadRequestException(passwordValidation.message);
    }

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
        // Validação de senha
        const passwordValidation = this.validatePassword(senha);
        if (!passwordValidation.isValid) {
          throw new BadRequestException(passwordValidation.message);
        }

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

  // Implementação comentada para remoção de usuário
  // não permitia excluir organizadores que tivessem corrida

  // async remove(id: number) {
  //   // Verificar se o usuário existe
  //   const existingUser = await this.usuarioRepository.findById(id);

  //   if (!existingUser) {
  //     throw new UsuarioNotFoundException(id);
  //   }

  //   await this.usuarioRepository.delete(id);

  //   return { message: 'Usuário removido com sucesso' };
  // }

  // async findByEmail(email: string) {
  //   return this.usuarioRepository.findByEmail(email);
  // }

  /**
   * Remover um usuário sendo usuario normal ou organizador
   * os eventos do organizador serão transferidos para o organizador desconhecido
   * o organizador desconhecido é um usuário padrão que não pode ser excluído
   * e não pode ser editado
   * @param id
   * @returns
   */
  async remove(id: number): Promise<Usuario> {
    // Verificar se o usuário existe
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UsuarioNotFoundException(id);
    }

    // Usar o ID do PAIZAO das constantes
    // Note: Convertendo para number já que está armazenado como string
    const ORGANIZADOR_DESCONHECIDO_ID = Number(APP_CONSTANTS.PAIZAO.ID);

    // Verificar se o usuário a ser excluído não é o próprio OrganizadorDesconhecido
    if (id === ORGANIZADOR_DESCONHECIDO_ID) {
      throw new BadRequestException('Esta conta não pode ser excluída');
    }

    try {
      // Se for um organizador, transferir eventos
      if (usuario.nivelPermissao === NivelPermissao.ORGANIZADOR) {
        // Usando o prisma diretamente ou através do repository
        await this.usuarioRepository.atualizarEventosDoOrganizador(
          id,
          ORGANIZADOR_DESCONHECIDO_ID,
        );
      }

      // Excluir o usuário
      return await this.usuarioRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao excluir usuário: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      );
    }
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
