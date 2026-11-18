import type { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabaseClient';
import type { AuthUser, LoginCredentials } from '../types/Auth.types';

export const AUTH_SERVICE_ERRORS = {
  INVALID_CREDENTIALS:
    'Credenciales incorrectas. Verifica tu correo y contraseña.',
  SERVICE_ERROR:
    'Ocurrió un error en el servicio. Por favor, inténtalo de nuevo.',
} as const;

const INVALID_CREDENTIALS_STATUS = 400;
const INVALID_CREDENTIALS_FRAGMENT = 'invalid login credentials';

export interface IAuthProvider {
  signInWithEmail: (credentials: LoginCredentials) => Promise<AuthUser>;
}

const mapSupabaseAuthErrorMessage = (error: AuthError): string => {
  const normalizedMessage = error.message.toLowerCase();
  const isInvalidCredentials =
    error.status === INVALID_CREDENTIALS_STATUS ||
    normalizedMessage.includes(INVALID_CREDENTIALS_FRAGMENT);

  if (isInvalidCredentials) {
    return AUTH_SERVICE_ERRORS.INVALID_CREDENTIALS;
  }

  return AUTH_SERVICE_ERRORS.SERVICE_ERROR;
};

export class SupabaseAuthProvider implements IAuthProvider {
  private readonly client: SupabaseClient;

  constructor(client: SupabaseClient = supabase) {
    this.client = client;
  }

  public readonly signInWithEmail = async (
    credentials: LoginCredentials,
  ): Promise<AuthUser> => {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(mapSupabaseAuthErrorMessage(error));
    }

    if (!data.user) {
      throw new Error(AUTH_SERVICE_ERRORS.SERVICE_ERROR);
    }

    return {
      email: data.user.email ?? credentials.email,
      id: data.user.id,
    };
  };
}

export const supabaseAuthProvider: IAuthProvider = new SupabaseAuthProvider();
