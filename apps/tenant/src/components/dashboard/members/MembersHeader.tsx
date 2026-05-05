import { PermissionGuard } from "@/components/shared/PermissionGuard";

interface MembersHeaderProps {
    onAddClick: () => void;
    isAllBranchesMode: boolean;
}

export function MembersHeader({ onAddClick, isAllBranchesMode }: MembersHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
                    Members
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                    Manage your gym members, assign trainers, and track their information.
                </p>
            </div>
            <PermissionGuard
                feature="MEMBERS"
                action="CREATE_UPDATE"
                fallback={null}
            >
                {!isAllBranchesMode ? (
                    <button
                        onClick={onAddClick}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors"
                    >
                        + Add Member
                    </button>
                ) : null}
            </PermissionGuard>
        </div>
    );
}
