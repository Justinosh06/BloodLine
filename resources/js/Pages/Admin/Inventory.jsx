import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Head } from '@inertiajs/react';
import { ChevronRight, Database, Hash, Activity } from "lucide-react";

export default function Inventory({ stock }) {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    return (
        <AdminLayout>
            <Head title="Live Inventory Status" />

            <div className="mb-10 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Infrastructure <ChevronRight size={10} /> Biological Stock
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Live Inventory Matrix</h2>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-tight">Centralized real-time storage monitoring system.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bloodTypes.map((type) => (
                    <Card key={type} className="border-border bg-white shadow-none rounded-none overflow-hidden group hover:border-indigo-200 transition-colors">
                        <div className="h-1 w-full bg-gray-50 group-hover:bg-indigo-600 transition-colors" />
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{type}</p>
                                <div className="h-8 w-8 border border-border flex items-center justify-center text-gray-400">
                                    <Database size={14} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Storage Volume</span>
                                    <span className="text-indigo-600">70%</span>
                                </div>
                                <Progress
                                    value={70}
                                    className="h-1 rounded-none bg-gray-100"
                                />
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <Hash size={10} /> Load
                                    </div>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">12 UNITS</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Storage Efficiency Metric */}
            <Card className="mt-8 border-border border-dashed bg-gray-50/50 shadow-none rounded-none">
                <CardContent className="py-6 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 border border-border bg-white flex items-center justify-center text-indigo-600">
                            <Activity size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Efficiency</p>
                            <p className="text-lg font-black text-gray-900 uppercase">System Optimal <span className="text-gray-400">|</span> 94.2%</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Code</p>
                        <p className="font-mono text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 border border-green-100">STABLE_RESERVE_MODE</p>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
