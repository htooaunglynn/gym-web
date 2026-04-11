import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function DashboardLoading() {
    return (
        <div className="min-h-[40vh] flex items-center justify-center">
            <LoadingSpinner text="Loading module..." />
        </div>
    );
}
