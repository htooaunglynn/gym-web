interface BranchScopeNoticeProps {
    isVisible: boolean;
    message?: string;
}

export function BranchScopeNotice({
    isVisible,
    message,
}: BranchScopeNoticeProps) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            {message ??
                "Viewing all branches is read-only. Select a single branch to manage records."}
        </div>
    );
}
