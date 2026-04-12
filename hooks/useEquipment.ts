"use client";

import { queryKeys } from "@/hooks/useApi";
import { createCrudHooks } from "@/hooks/useCrudEntity";
import * as equipmentService from "@/services/equipment";
import { ListEquipmentParams } from "@/services/equipment";
import { CreateEquipmentPayload, UpdateEquipmentPayload, Equipment } from "@/types/entities";

const equipmentCrudHooks = createCrudHooks<Equipment, CreateEquipmentPayload, UpdateEquipmentPayload, ListEquipmentParams>({
    queryKeys: queryKeys.equipment,
    service: {
        list: equipmentService.getEquipment,
        detail: equipmentService.getEquipmentById,
        create: equipmentService.createEquipment,
        update: equipmentService.updateEquipment,
        remove: equipmentService.deleteEquipment,
    },
});

export const useEquipment = equipmentCrudHooks.useList;
export const useEquipmentItem = equipmentCrudHooks.useDetail;
export const useCreateEquipment = equipmentCrudHooks.useCreate;
export const useUpdateEquipment = equipmentCrudHooks.useUpdate;
export const useDeleteEquipment = equipmentCrudHooks.useDelete;
