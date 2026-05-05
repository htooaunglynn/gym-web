export function CapacityWidget() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-gray-900 font-bold text-base mb-6">Class Capacity Usage</h2>
      
      <div className="relative w-full h-2.5 rounded-full bg-gray-100 overflow-hidden mb-3">
        {/* Fill equivalent to spending limit */}
        <div className="absolute top-0 left-0 h-full bg-[#FF5C39] w-[35%] rounded-full z-10" />
        {/* Striped pattern equivalent to available balance graphic */}
        <div 
          className="absolute top-0 left-[35%] h-full w-[65%] rounded-r-full opacity-30" 
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, #D1D5DB 4px, #D1D5DB 8px)' }}
        />
      </div>
      
      <div className="flex justify-between items-center text-xs font-bold text-gray-500">
        <div><span className="text-gray-900 text-sm">1,400</span> booked out of</div>
        <div className="text-gray-900 text-sm">5,500 total</div>
      </div>
    </div>
  );
}
