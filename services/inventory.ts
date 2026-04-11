import { get, post } from "@/lib/api-client";
import {
    InventoryMovement,
    CreateIncomingMovementPayload,
    CreateOutgoingMovementPayload,
    CreateAdjustmentMovementPayload,
} from "@/types/entities";
import { PaginatedResponse } from "@/types/api";

export interface ListInventoryParams {
    page?: number;
    limit?: number;
    equipmentId?: string;
    type?: string;
    from?: string;
    to?: string;
}

export async function getInventoryMovements(
    params?: ListInventoryParams,
): Promise<PaginatedResponse<InventoryMovement>> {
    return get<PaginatedResponse<InventoryMovement>>(
        "/inventory-movements",
        params as Record<string, unknown>,
    );
}

export async function getInventoryMovementById(id: string): Promise<InventoryMovement> {
    return get<InventoryMovement>(`/inventory-movements/${id}`);
}

export async function createIncoming(
    payload: CreateIncomingMovementPayload,
): Promise<InventoryMovement> {
    return post<InventoryMovement>("/inventory-movements/incoming", payload);
}

export async function createOutgoing(
    payload: CreateOutgoingMovementPayload,
): Promise<InventoryMovement> {
    return post<InventoryMovement>("/inventory-movements/outgoing", payload);
}

export async function createAdjustment(
    payload: CreateAdjustmentMovementPayload,
): Promise<InventoryMovement> {
    return post<InventoryMovement>("/inventory-movements/adjustments", payload);
}
