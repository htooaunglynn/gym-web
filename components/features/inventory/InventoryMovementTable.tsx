import React from "react";
import { InventoryMovement } from "@/types/entities";
import { Badge } from "@/components/shared/Badge";
import { formatDateTime } from "@/lib/formatters";

interface InventoryMovementTableProps {
    movements: InventoryMovement[];
}

const typeMeta: Record<InventoryMovement["type"], { label: string; variant: "success" | "warning" | "info" }> = {
    INCOMING: { label: "Incoming", variant: "success" },
    OUTGOING: { label: "Outgoing", variant: "warning" },
    ADJUSTMENT: { label: "Adjustment", variant: "info" },
};

export function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[980px]">
                <caption className="sr-only">Inventory movement history for incoming, outgoing, and adjustments</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Equipment</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Quantity</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Timestamp</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Notes</th>
                    </tr>
                </thead>

                <tbody>
                    {movements.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant">
                                No movement records found.
                            </td>
                        </tr>
                    ) : (
                        movements.map((movement) => (
                            <tr key={movement.id} className="border-t border-outline-variant/20">
                                <td className="px-4 py-3 text-body-md font-semibold text-on-surface">
                                    {movement.equipment?.name || movement.equipmentId}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge variant={typeMeta[movement.type].variant} size="sm">
                                        {typeMeta[movement.type].label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">{movement.quantity}</td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {formatDateTime(movement.createdAt)}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {movement.notes || "-"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
