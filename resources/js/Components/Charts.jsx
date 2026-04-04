import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';

export const RequestTrends = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <AreaChart data={data}>
            <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFulfilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
                type="monotone" 
                dataKey="requests" 
                stroke="#ef4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRequests)" 
            />
            <Area 
                type="monotone" 
                dataKey="fulfilled" 
                stroke="#94a3b8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorFulfilled)" 
            />
        </AreaChart>
    </ResponsiveContainer>
);

export const BloodTypeDistribution = ({ data }) => {
    const COLORS = ['#ef4444', '#f87171', '#fb923c', '#fbbf24', '#3b82f6', '#60a5fa', '#10b981', '#34d399'];
    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
                <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const HospitalPerformanceChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%" minHeight={200}>
        <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                width={100}
            />
            <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="requests" fill="#fee2e2" radius={[0, 4, 4, 0]} barSize={20} />
            <Bar dataKey="fulfilled" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
    </ResponsiveContainer>
);

export const DonationStatusChart = ({ data }) => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];
    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
                <Pie
                    data={data}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};
