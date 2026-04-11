import { get, post, patch, del } from "@/lib/api-client";
import {
    Equipment,
    CreateEquipmentPayload,
    UpdateEquipmentPayload,
} from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListEquipmentParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
}

export async function getEquipment(params?: ListEquipmentParams): Promise<PaginatedResponse<Equipment>> {
    return get<PaginatedResponse<Equipment>>("/equipment", params as Record<string, unknown>);
}

export async function getEquipmentById(id: string): Promise<Equipment> {
    return get<Equipment>(`/equipment/${id}`);
}

export async function createEquipment(payload: CreateEquipmentPayload): Promise<Equipment> {
    return post<Equipment>("/equipment", payload);
}

export async function updateEquipment(id: string, payload: UpdateEquipmentPayload): Promise<Equipment> {
    return patch<Equipment>(`/equipment/${id}`, payload);
}

export async function deleteEquipment(id: string): Promise<void> {
    return del<void>(`/equipment/${id}`);
}
