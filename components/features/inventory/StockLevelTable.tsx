import React from "react";
import { Equipment } from "@/types/entities";
import { Badge } from "@/components/shared/Badge";
import { EQUIPMENT_STATUS_META } from "@/lib/constants";

interface StockLevelTableProps {
    equipment: Equipment[];
}

export function StockLevelTable({ equipment }: StockLevelTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[760px]">
                <caption className="sr-only">Current stock levels and equipment status</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Equipment</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Category</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Stock</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">
                                No equipment available.
                            </td>
                        </tr>
                    ) : (
                        equipment.map((item) => {
                            const statusMeta = EQUIPMENT_STATUS_META[item.status];
                            return (
                                <tr key={item.id} className="border-t border-outline-variant/20">
                                    <td className="px-4 py-3 text-body-md font-semibold text-on-surface">{item.name}</td>
                                    <td className="px-4 py-3 text-body-md text-on-surface">{item.category}</td>
                                    <td className="px-4 py-3 text-body-md text-on-surface">{item.quantity}</td>
                                    <td className="px-4 py-3">
                                        <Badge variant={statusMeta.variant} size="sm">
                                            {statusMeta.label}
                                        </Badge>
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
