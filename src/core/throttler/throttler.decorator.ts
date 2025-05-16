import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

/**
 * Decorator para pular o rate limiting para um endpoint específico
 * Use em endpoints internos ou em rotas que não devem ter limitação
 */
export const SkipThrottle = () => SetMetadata('skipThrottle', true);

/**
 * Proteção para ações sensíveis (login, registro, alteração de senha)
 * Limita a 3 tentativas por segundo para prevenir ataques de força bruta
 */
export const ThrottleAuth = () => Throttle({ short: { limit: 3, ttl: 1000 } });

/**
 * Proteção padrão para a maioria dos endpoints
 * Balanceada para uso normal com proteção moderada
 */
export const ThrottleDefault = () =>
  Throttle({ medium: { limit: 10, ttl: 5000 } });

/**
 * Proteção muito restritiva para endpoints críticos
 * Use em endpoints que precisam de proteção extra contra spam/abusos
 */
export const ThrottleStrict = () =>
  Throttle({ short: { limit: 2, ttl: 1000 } });

/**
 * Proteção padrão para endpoints de escrita (POST, PUT, DELETE)
 * Balanceada para permitir uso normal mas prevenir abusos
 */
export const ThrottleWrite = () =>
  Throttle({ medium: { limit: 5, ttl: 10000 } });

/**
 * Proteção leve para endpoints de leitura (GET)
 * Permite maior volume de requisições para operações de leitura
 */
export const ThrottleRead = () => Throttle({ long: { limit: 50, ttl: 10000 } });

/**
 * Proteção para endpoints públicos que não exigem autenticação
 * Mais permissiva, mas ainda oferece proteção contra DoS
 */
export const ThrottlePublic = () =>
  Throttle({ long: { limit: 30, ttl: 60000 } });
