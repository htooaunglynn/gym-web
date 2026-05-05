import { Plus } from "lucide-react";

interface TrainersHeaderProps {
    onAddClick: () => void;
    canCreate: boolean;
}

export function TrainersHeader({ onAddClick, canCreate }: TrainersHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-4">
                    Trainers
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                    Manage your gym trainers, specializations, and contact details.
                </p>
            </div>
            {canCreate && (
                <button
                    onClick={onAddClick}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-colors flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Trainer
                </button>
            )}
        </div>
    );
}
