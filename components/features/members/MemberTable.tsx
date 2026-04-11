import React from "react";
import { Member } from "@/types/entities";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { formatDate, formatPhone } from "@/lib/formatters";

interface MemberTableProps {
    members: Member[];
    onEdit: (member: Member) => void;
    onDelete: (member: Member) => void;
    isDeleting?: boolean;
}

export function MemberTable({
    members,
    onEdit,
    onDelete,
    isDeleting = false,
}: MemberTableProps) {
    return (
        <div className="overflow-x-auto rounded-md border border-outline-variant/30">
            <table className="w-full min-w-[900px]">
                <caption className="sr-only">Members list with contact details, assigned trainer, and actions</caption>
                <thead className="bg-surface-container-low">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Email</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Phone</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Trainer</th>
                        <th scope="col" className="px-4 py-3 text-left text-label-md text-on-surface-variant">Joined</th>
                        <th scope="col" className="px-4 py-3 text-right text-label-md text-on-surface-variant">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {members.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                                No members found.
                            </td>
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member.id} className="border-t border-outline-variant/20">
                                <td className="px-4 py-3">
                                    <p className="text-body-md font-semibold text-on-surface">
                                        {member.firstName} {member.lastName}
                                    </p>
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface">{member.email}</td>
                                <td className="px-4 py-3 text-body-md text-on-surface">{formatPhone(member.phone)}</td>
                                <td className="px-4 py-3">
                                    {member.trainer ? (
                                        <Badge variant="info" size="sm">
                                            {member.trainer.firstName} {member.trainer.lastName}
                                        </Badge>
                                    ) : (
                                        <span className="text-body-md text-on-surface-variant">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-body-md text-on-surface-variant">
                                    {formatDate(member.createdAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => onEdit(member)}>
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onDelete(member)}
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
