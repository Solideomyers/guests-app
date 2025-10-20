import { z } from 'zod';

/**
 * Guest Form Validation Schema
 * Validaciones con mensajes en español y reglas específicas
 */
export const guestFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'El apellido solo puede contener letras'
    ),

  phone: z
    .string()
    .min(1, 'El teléfono es obligatorio')
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      'El teléfono solo puede contener números, espacios, guiones, paréntesis y +'
    )
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres'),

  church: z
    .string()
    .min(1, 'La iglesia es obligatoria')
    .max(100, 'El nombre de la iglesia no puede exceder 100 caracteres'),

  city: z
    .string()
    .min(1, 'La ciudad es obligatoria')
    .max(50, 'El nombre de la ciudad no puede exceder 50 caracteres'),

  address: z
    .string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),

  state: z
    .string()
    .max(50, 'El estado/provincia no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),

  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
    .or(z.literal('')),

  isPastor: z.boolean().default(false),
});

export type GuestFormData = z.infer<typeof guestFormSchema>;
