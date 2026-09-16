import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .min(1, 'E-Mail ist erforderlich'),
  password: z.string()
    .min(1, 'Passwort ist erforderlich'),
});

export const RegisterSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail-Adresse')
    .min(1, 'E-Mail ist erforderlich'),
  password: z.string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .max(100, 'Passwort darf maximal 100 Zeichen lang sein'),
  confirmPassword: z.string()
    .min(1, 'Passwort-Bestätigung ist erforderlich'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
