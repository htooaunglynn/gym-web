import { AuthUser } from "@/services/auth.service";

interface AccountSectionProps {
    user: AuthUser | null;
    activeBranchId: string | null;
    logout: () => void;
    title: string;
    description: string;
}

export function AccountSection({
    user,
    activeBranchId,
    logout,
    title,
    description,
}: AccountSectionProps) {
    return (
        <div className="animate-in fade-in duration-300 max-w-[1600px] mx-auto pt-8 space-y-6">
            <section className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {title}
                </h1>
                <p className="text-gray-600 text-base lg:text-lg max-w-2xl mb-6">
                    {description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                            Email
                        </p>
                        <p className="text-lg font-semibold text-gray-900 break-all">
                            {user?.email ?? "Not available"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                            Role
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                            {user?.globalRole ?? "Not available"}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50 md:col-span-2">
                        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                            Active Branch
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                            {activeBranchId ?? user?.branchId ?? "No branch selected"}
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={logout}
                        className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </section>
        </div>
    );
}
