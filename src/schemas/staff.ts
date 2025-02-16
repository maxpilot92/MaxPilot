import { z } from "zod";

export const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  language: z.string().optional(),
  nationality: z.string().optional(),
  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be at least 10 digits"),
  gender: z.enum(["Female", "Male"]),
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;
