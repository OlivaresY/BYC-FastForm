import { z } from 'zod';

export const LOGIN_CREDENTIALS_ERRORS = {
  EMAIL_INVALID: 'Correo electrónico inválido',
  EMAIL_REQUIRED: 'El correo electrónico es obligatorio',
  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
} as const;

export const LoginCredentialsSchema = z.object({
  email: z
    .string({ error: LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED })
    .trim()
    .min(1, LOGIN_CREDENTIALS_ERRORS.EMAIL_REQUIRED)
    .pipe(z.email({ error: LOGIN_CREDENTIALS_ERRORS.EMAIL_INVALID })),
  password: z
    .string({ error: LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED })
    .min(1, LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED)
    .refine(
      (value) => value.trim().length > 0,
      LOGIN_CREDENTIALS_ERRORS.PASSWORD_REQUIRED,
    ),
});

export type LoginCredentialsSchemaOutput = z.infer<
  typeof LoginCredentialsSchema
>;
