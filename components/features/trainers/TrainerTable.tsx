import React from "react";
import { Trainer } from "@/types/entities";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { formatDate, formatPhone } from "@/lib/formatters";

interface TrainerTableProps {
    trainers: Trainer[];
    onEdit: (trainer: Trainer) => void;
    onDelete: (trainer: Trainer) => void;
    isDeleting?: boolean;
}

export function TrainerTable({
    trainers,
    onEdit,
    onDelete,
    isDeleting = false,
}: TrainerTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[900px]">
                <caption className="sr-only">Trainers list with contact details, active members, and actions</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Email</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Phone</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Members</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Joined</th>
                        <th scope="col" className="px-4 py-3 text-right text-label-md text-on-surface-variant">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {trainers.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                                No trainers found.
                            </td>
                        </tr>
                    ) : (
                        trainers.map((trainer) => (
                            <tr key={trainer.id} className="border-t border-outline-variant/20">
                                <td className="px-4 py-3">
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {trainer.firstName} {trainer.lastName}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">{trainer.email}</td>
                                <td className="px-4 py-3 text-body-md text-on-surface">{formatPhone(trainer.phone)}</td>
                                <td className="px-4 py-3">
                                    <Badge variant="info" size="sm">
                                        {trainer.members?.length ?? 0} active
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {formatDate(trainer.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => onEdit(trainer)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onDelete(trainer)}
                                            disabled={isDeleting}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
