import { z } from "zod";

// Create User validation
export const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please provide a valid email"),

  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must not exceed 255 characters")
});

// Update User validation
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters")
    .optional(),
})


export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Current password is required",
    }),
  newPassword: z
    .string({
      required_error: "New password is required",
    })
});



