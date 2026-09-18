import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresá un email válido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Ingresá tu nombre").max(100),
    lastName: z.string().trim().min(2, "Ingresá tu apellido").max(100),
    email: z.email("Ingresá un email válido").max(255),
    phone: z.string().trim().max(40, "Máximo 40 caracteres").optional(),
    password: z.string().min(8, "Mínimo 8 caracteres").max(128),
    passwordConfirmation: z.string().min(8, "Repetí la contraseña").max(128),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
