import { useState } from "react";
import { X } from "lucide-react";
import { TrainerSelect } from "@/components/forms/TrainerSelect";

interface Trainer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface AssignTrainerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (trainer: Trainer | null) => Promise<void>;
    isLoading: boolean;
    initialTrainer?: Trainer | null;
}

export function AssignTrainerModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    initialTrainer = null,
}: AssignTrainerModalProps) {
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(initialTrainer);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden shadow-black/10">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Assign Trainer
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <TrainerSelect
                        onSelect={setSelectedTrainer}
                        selectedTrainerId={selectedTrainer?.id}
                        label="Select Trainer"
                    />

                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onConfirm(selectedTrainer)}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Assigning..." : "Assign Trainer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
