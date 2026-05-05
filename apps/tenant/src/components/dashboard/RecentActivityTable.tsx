import {
    Filter,
    Search,
    MoreHorizontal,
    ShoppingBag,
    Droplet,
    Monitor,
} from "lucide-react";

interface InventoryActivity {
    id: string;
    movementType: "INCOMING" | "OUTGOING" | "ADJUSTMENT";
    quantity: number;
    reason: string;
    occurredAt: string;
}

export function RecentActivityTable({
    activities = [],
}: {
    activities?: InventoryActivity[];
}) {
    return (
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
            {/* Header and Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <h2 className="text-gray-900 font-bold text-lg">Recent Inventory Activity</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-gray-300 w-48 transition-colors"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Filter <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-semibold text-gray-400 border-b border-gray-100">
                            <th className="py-3 px-2 w-[40px]">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 pointer-events-none opacity-50" />
                            </th>
                            <th className="py-3 px-2 font-medium">Movement ID</th>
                            <th className="py-3 px-2 font-medium">Type</th>
                            <th className="py-3 px-2 font-medium">Quantity</th>
                            <th className="py-3 px-2 font-medium">Reason</th>
                            <th className="py-3 px-2 font-medium">Date</th>
                            <th className="py-3 px-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {activities.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-gray-400">No recent activity found.</td>
                            </tr>
                        ) : null}
                        {activities.map((item) => (
                            <tr key={item.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors`}>
                                <td className="py-4 px-2">
                                    <input type="checkbox" readOnly className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-gray-900 text-gray-900" style={{ borderRadius: '4px' }} />
                                </td>
                                <td className="py-4 px-2 font-medium text-gray-500">#{item.id.substring(0, 8)}</td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.movementType === 'INCOMING' ? 'bg-blue-50' :
                                                item.movementType === 'OUTGOING' ? 'bg-red-50' : 'bg-yellow-50'
                                            }`}>
                                            {item.movementType === 'INCOMING' ? <ShoppingBag className="w-4 h-4 text-blue-500" /> :
                                                item.movementType === 'OUTGOING' ? <Droplet className="w-4 h-4 text-red-500" /> :
                                                    <Monitor className="w-4 h-4 text-yellow-500" />}
                                        </div>
                                        <span className="font-semibold text-gray-900">{item.movementType}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-2 font-bold text-gray-900">{item.quantity > 0 ? `+${item.quantity}` : item.quantity}</td>
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-1.5 font-medium text-gray-500 text-xs">
                                        {item.reason}
                                    </div>
                                </td>
                                <td className="py-4 px-2 text-gray-500 font-medium text-xs">{new Date(item.occurredAt).toLocaleString()}</td>
                                <td className="py-4 px-2 text-right">
                                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
