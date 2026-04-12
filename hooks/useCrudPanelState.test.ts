import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCrudPanelState } from "@/hooks/useCrudPanelState";

describe("useCrudPanelState", () => {
    it("opens create mode with no selected entity", () => {
        const { result } = renderHook(() => useCrudPanelState<{ id: string }>());

        act(() => {
            result.current.openCreate();
        });

        expect(result.current.panelMode).toBe("create");
        expect(result.current.selectedEntity).toBeNull();
    });

    it("opens edit mode with the selected entity and resets on close", () => {
        const { result } = renderHook(() => useCrudPanelState<{ id: string }>());
        const entity = { id: "member-1" };

        act(() => {
            result.current.openEdit(entity);
        });

        expect(result.current.panelMode).toBe("edit");
        expect(result.current.selectedEntity).toEqual(entity);

        act(() => {
            result.current.closePanel();
        });

        expect(result.current.panelMode).toBeNull();
        expect(result.current.selectedEntity).toBeNull();
    });
});
