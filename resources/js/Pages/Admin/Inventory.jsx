import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Head } from '@inertiajs/react';
import { ChevronRight, Database, Hash, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Inventory({ inventory }) {
    return (
        <AdminLayout>
            <Head title="Live Inventory Status" />

            <div className="mb-10 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                    Infrastructure <ChevronRight size={10} /> Biological Stock
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Live Inventory Matrix</h2>
                <p className="text-gray-500 mt-2 font-medium">Centralized real-time storage monitoring across the entire network.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {inventory.map((item) => (
                    <Card key={item.blood_type} className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                        <div className={cn(
                            "h-1.5 w-full transition-colors duration-500",
                            item.status === 'critical' ? "bg-red-500" : 
                            item.status === 'low' ? "bg-orange-500" : "bg-green-500"
                        )} />
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <p className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{item.blood_type}</p>
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500",
                                    item.status === 'critical' ? "bg-red-50 text-red-600" : 
                                    item.status === 'low' ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                                )}>
                                    <Database size={20} />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Storage Volume</span>
                                    <span className={cn(
                                        "font-bold",
                                        item.status === 'critical' ? "text-red-600" : 
                                        item.status === 'low' ? "text-orange-600" : "text-green-600"
                                    )}>{Math.round(item.percentage)}%</span>
                                </div>
                                <Progress
                                    value={item.percentage}
                                    className="h-1.5 rounded-full bg-gray-100"
                                />
                                <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Hash size={12} /> Available
                                    </div>
                                    <p className="text-lg font-black text-gray-900 tracking-tight">{item.total_available} <span className="text-xs text-gray-400 font-bold uppercase">Units</span></p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Activity size={12} /> Reserved
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 tracking-tight">{item.total_reserved} <span className="text-[10px] uppercase font-black">Units</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Storage Efficiency Metric */}
            <Card className="mt-8 border-border border-dashed bg-gray-50/50 shadow-none rounded-[2rem] overflow-hidden">
                <CardContent className="py-6 px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Efficiency</p>
                            <p className="text-lg font-black text-gray-900 uppercase">System Optimal <span className="text-gray-400">|</span> 94.2%</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto md:text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Code</p>
                        <p className="font-mono text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100 inline-block">STABLE_RESERVE_MODE</p>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
