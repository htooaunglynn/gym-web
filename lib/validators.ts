import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 loosely
const passwordMin = 8;

const phoneField = z
    .string()
    .optional()
    .refine((v) => !v || phoneRegex.test(v.replace(/\s|\(|\)|-/g, "")), {
        message: "Enter a valid phone number (e.g. +1 555 000-1234)",
    });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    accountType: z.enum(["USER", "MEMBER"]).optional(),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerMemberSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: phoneField,
    password: z
        .string()
        .min(passwordMin, `Password must be at least ${passwordMin} characters`)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});
export type RegisterMemberFormValues = z.infer<typeof registerMemberSchema>;

// ─── Members ─────────────────────────────────────────────────────────────────
export const createMemberSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: phoneField,
    password: z
        .string()
        .min(passwordMin, `Password must be at least ${passwordMin} characters`)
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),
    trainerId: z.string().optional(),
});
export type CreateMemberFormValues = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
    email: z.string().email("Enter a valid email address").optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    phone: phoneField,
    trainerId: z.string().nullable().optional(),
});
export type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;

// ─── Trainers ─────────────────────────────────────────────────────────────────
export const createTrainerSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: phoneField,
});
export type CreateTrainerFormValues = z.infer<typeof createTrainerSchema>;

export const updateTrainerSchema = createTrainerSchema.partial();
export type UpdateTrainerFormValues = z.infer<typeof updateTrainerSchema>;

// ─── Users ────────────────────────────────────────────────────────────────────
export const createUserSchema = z.object({
    email: z.string().email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: phoneField,
    role: z.enum(["ADMIN", "STAFF", "HR", "TRAINER", "MEMBER"]),
    password: z
        .string()
        .min(passwordMin, `Password must be at least ${passwordMin} characters`)
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),
});
export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    email: z.string().email("Enter a valid email address").optional(),
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    phone: phoneField,
    role: z.enum(["ADMIN", "STAFF", "HR", "TRAINER", "MEMBER"]).optional(),
});
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

// ─── Equipment ────────────────────────────────────────────────────────────────
export const createEquipmentSchema = z.object({
    name: z.string().min(1, "Equipment name is required"),
    category: z.string().min(1, "Category is required"),
    quantity: z
        .number({ invalid_type_error: "Quantity must be a number" })
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative"),
    status: z
        .enum(["OPERATIONAL", "UNDER_MAINTENANCE", "DAMAGED", "RETIRED"])
        .optional(),
    notes: z.string().optional(),
});
export type CreateEquipmentFormValues = z.infer<typeof createEquipmentSchema>;

export const updateEquipmentSchema = z.object({
    name: z.string().min(1, "Equipment name is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    status: z
        .enum(["OPERATIONAL", "UNDER_MAINTENANCE", "DAMAGED", "RETIRED"])
        .optional(),
    notes: z.string().optional(),
});
export type UpdateEquipmentFormValues = z.infer<typeof updateEquipmentSchema>;

// ─── Attendance ───────────────────────────────────────────────────────────────
export const checkInSchema = z.object({
    memberId: z.string().min(1, "Please select a member"),
    timestamp: z.string().optional(),
    notes: z.string().optional(),
});
export type CheckInFormValues = z.infer<typeof checkInSchema>;

export const checkOutSchema = checkInSchema;
export type CheckOutFormValues = z.infer<typeof checkOutSchema>;

export const correctionSchema = z.object({
    memberId: z.string().min(1, "Please select a member"),
    type: z.enum(["CHECK_IN", "CHECK_OUT"]),
    timestamp: z.string().min(1, "Timestamp is required"),
    notes: z.string().optional(),
});
export type CorrectionFormValues = z.infer<typeof correctionSchema>;

// ─── Inventory Movements ─────────────────────────────────────────────────────
export const inventoryMovementSchema = z.object({
    equipmentId: z.string().min(1, "Please select equipment"),
    quantity: z
        .number({ invalid_type_error: "Quantity must be a number" })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1"),
    notes: z.string().optional(),
});
export type InventoryMovementFormValues = z.infer<typeof inventoryMovementSchema>;
