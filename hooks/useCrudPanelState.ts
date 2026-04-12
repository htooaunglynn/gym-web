"use client";

import { useState } from "react";

export type CrudPanelMode = "create" | "edit" | null;

export function useCrudPanelState<TEntity>() {
    const [panelMode, setPanelMode] = useState<CrudPanelMode>(null);
    const [selectedEntity, setSelectedEntity] = useState<TEntity | null>(null);

    const openCreate = () => {
        setSelectedEntity(null);
        setPanelMode("create");
    };

    const openEdit = (entity: TEntity) => {
        setSelectedEntity(entity);
        setPanelMode("edit");
    };

    const closePanel = () => {
        setSelectedEntity(null);
        setPanelMode(null);
    };

    return {
        panelMode,
        selectedEntity,
        openCreate,
        openEdit,
        closePanel,
    };
}
