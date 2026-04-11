import React from "react";
import { Equipment } from "@/types/entities";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { formatDate } from "@/lib/formatters";
import { EQUIPMENT_STATUS_META } from "@/lib/constants";

interface EquipmentTableProps {
    equipment: Equipment[];
    onEdit: (item: Equipment) => void;
    onDelete: (item: Equipment) => void;
    isDeleting?: boolean;
}

export function EquipmentTable({
    equipment,
    onEdit,
    onDelete,
    isDeleting = false,
}: EquipmentTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[960px]">
                <caption className="sr-only">Equipment list with status, quantity, and actions</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Category</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Quantity</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Updated</th>
                        <th scope="col" className="px-4 py-3 text-right text-label-md text-on-surface-variant">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {equipment.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                                No equipment found.
                            </td>
                        </tr>
                    ) : (
                        equipment.map((item) => {
                            const statusMeta = EQUIPMENT_STATUS_META[item.status];
                            return (
                                <tr key={item.id} className="border-t border-outline-variant/20">
                                    <td className="px-4 py-3">
                                        <p className="text-body-md font-semibold text-on-surface">{item.name}</p>
                                        {item.notes ? (
                                            <p className="text-label-md text-on-surface-variant mt-1 line-clamp-1">{item.notes}</p>
                                        ) : null}
                                    </td>
                                    <td className="px-4 py-3 text-body-md text-on-surface">{item.category}</td>
                                    <td className="px-4 py-3 text-body-md text-on-surface">{item.quantity}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusMeta.variant} size="sm">
                                            {statusMeta.label}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                        {formatDate(item.updatedAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDelete(item)}
                                                disabled={isDeleting}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
