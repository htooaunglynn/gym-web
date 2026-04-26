"use client";

import { CITIES, TOWNSHIPS, City } from "@/constants/locations";

interface LocationSelectorProps {
  city: string;
  township: string;
  onCityChange: (city: string) => void;
  onTownshipChange: (township: string) => void;
  className?: string;
}

export function LocationSelector({
  city,
  township,
  onCityChange,
  onTownshipChange,
  className = "",
}: LocationSelectorProps) {
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    onCityChange(newCity);
    onTownshipChange(""); // Reset township when city changes
  };

  const handleTownshipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTownshipChange(e.target.value);
  };

  const availableTownships = city ? TOWNSHIPS[city as City] || [] : [];

  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
          City
        </label>
        <select
          value={city}
          onChange={handleCityChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm bg-white"
        >
          <option value="">Select City</option>
          {Object.values(CITIES).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
          Township
        </label>
        <select
          value={township}
          onChange={handleTownshipChange}
          disabled={!city}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gray-900 focus:outline-none transition-colors text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="">Select Township</option>
          {availableTownships.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
