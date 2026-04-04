import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Activity, Thermometer, Box, AlertTriangle, ChevronRight, Hash, Database } from "lucide-react";

export default function Inventory({ auth, bloodStocks, hospitalCapacity }) {
    const totalUnits = bloodStocks.reduce(
        (sum, item) => sum + (Number(item.available_units) || 0),
        0
    );
    const totalCapacity = Number(hospitalCapacity) || 0;
    const efficiency = totalCapacity > 0 ? Math.round((totalUnits / totalCapacity) * 100) : 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> Storage Matrix
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Inventory Infrastructure</h2>
                </div>
            }
        >
            <Head title="Blood Inventory" />

            <div className="space-y-8">
                {/* Deployment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border bg-white shadow-none rounded-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Total Capacity</p>
                                <Database size={14} className="text-indigo-500" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-4xl font-black text-gray-900 tracking-tighter">{totalUnits}</p>
                                <p className="text-gray-400 font-bold tracking-tight text-sm">/ {totalCapacity} Units</p>
                            </div>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                                <span className="h-1 w-1 bg-indigo-500 rounded-none" />
                                Synchronized
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none rounded-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Depletion Alerts</p>
                                <AlertTriangle size={14} className="text-red-500" />
                            </div>
                            <p className="text-4xl font-black text-red-600 tracking-tighter">{bloodStocks.filter(i => i.status === 'critical').length}</p>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-red-600 font-bold">
                                <span className="h-1 w-1 bg-red-500 rounded-none" />
                                Priority Required
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none rounded-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Array Efficiency</p>
                                <Activity size={14} className="text-indigo-500" />
                            </div>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{efficiency}%</p>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                <span className="h-1 w-1 bg-green-500 rounded-none" />
                                Load Optimized
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Matrix Details */}
                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                    <CardHeader className="pb-8 pt-6 border-b border-border bg-gray-50/30">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-2">
                            <Hash size={12} /> Live Sequence
                        </div>
                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Storage Array Matrix</CardTitle>
                        <CardDescription className="text-gray-500 font-medium font-mono text-[11px]">Granularity check on biological sequence distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 py-10 px-10">
                        {bloodStocks.map((item) => (
                            <div key={item.id} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-black text-xl">
                                            {item.blood_type}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-gray-900">{item.available_units} Units</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`h-1.5 w-1.5 rounded-none ${item.status === 'critical' ? 'bg-red-500' : item.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    {item.status === 'critical' ? "Critical Level" : item.status === 'low' ? "Low Stock" : "Good Supply"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-black tracking-tighter ${item.status === 'critical' ? 'text-red-600' : item.status === 'low' ? 'text-yellow-600' : 'text-gray-900'}`}>{item.utilization}%</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Capacity Used</p>
                                    </div>
                                </div>
                                <Progress
                                    value={item.utilization}
                                    className="h-1.5 rounded-none bg-gray-100"
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Logs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    <Card className="border-border bg-white shadow-none rounded-none border-l-4 border-l-red-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                Expiration Protocol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <div className="space-y-2 text-[11px] font-mono text-gray-600">
                                <p><span className="text-red-600 font-bold">[O+] 5 units</span> terminal storage phase in 3d</p>
                                <p><span className="text-red-600 font-bold">[B-] 2 units</span> terminal storage phase in 7d</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none rounded-none border-l-4 border-l-indigo-600">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-4 w-4 text-indigo-600" />
                                Cluster Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <div className="space-y-2 text-[11px] font-mono text-gray-600">
                                <p>Optimized for <span className="text-indigo-600 font-bold">Regional Cluster A</span></p>
                                <p>Next broadcast cycle in <span className="text-indigo-600 font-bold">4.2 hours</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

