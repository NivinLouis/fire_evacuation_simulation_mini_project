"use client";

import { StatDataPoint } from "../types";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface Props {
  history: StatDataPoint[];
}

export default function Charts({ history }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Human Status Chart */}
      <div className="flex flex-col">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Human Status</h3>
        <div className="h-[180px] w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="step" textAnchor="end" height={40} fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="alive" name="Alive" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="dead" name="Dead" stroke="#dc2626" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="escaped" name="Escaped" stroke="#16a34a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Human Mobility Chart */}
      <div className="flex flex-col">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Human Mobility</h3>
        <div className="h-[180px] w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="step" textAnchor="end" height={40} fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="normal" name="Normal" stroke="#059669" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="panic" name="Panic" stroke="#ea580c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="incapacitated" name="Incapacitated" stroke="#9333ea" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Human Collaboration Chart */}
      <div className="flex flex-col">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Human Collaboration</h3>
        <div className="h-[180px] w-full bg-slate-50/50 border border-slate-200 rounded-xl p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="step" textAnchor="end" height={40} fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: '14px', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line type="monotone" dataKey="verbal_collaboration" name="Verbal" stroke="#eab308" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="physical_collaboration" name="Physical" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="morale_collaboration" name="Morale" stroke="#ec4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}