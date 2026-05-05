"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', profit: 30, loss: 20 },
  { name: 'Feb', profit: 40, loss: 15 },
  { name: 'Mar', profit: 35, loss: 10 },
  { name: 'Apr', profit: 42, loss: 28 },
  { name: 'May', profit: 48, loss: 25 },
  { name: 'Jun', profit: 38, loss: 18 },
  { name: 'Jul', profit: 30, loss: 12 },
  { name: 'Aug', profit: 0, loss: 0 },
];

export function AttendanceChart() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-gray-900 font-bold text-base mb-1">Check-ins & Growth</h2>
          <p className="text-sm text-gray-500 font-medium">View your gym traffic in a certain period of time</p>
        </div>
      </div>

      <div className="flex justify-between items-end mb-6 text-xs font-bold text-gray-500">
        <div>Total Sign-ups and Check-ins</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#FF5C39]"></span> Check-ins</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-[2px] bg-[#1C1F26]"></span> Sign-ups</div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(val) => `${val}k`} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            {/* The Bars */}
            <Bar dataKey="profit" fill="#FF5C39" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="loss" fill="#1C1F26" radius={[0, 0, 4, 4]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
