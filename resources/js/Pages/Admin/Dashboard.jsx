import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Clock, Shield, AlertTriangle, ChevronRight, Database, Hash } from "lucide-react";

export default function AdminDashboard({ auth }) {
    const bloodInventory = [
        { type: 'O+', units: 45, critical: false },
        { type: 'O-', units: 12, critical: true },
        { type: 'A+', units: 38, critical: false },
        { type: 'A-', units: 8, critical: true },
        { type: 'B+', units: 22, critical: false },
        { type: 'B-', units: 5, critical: true },
        { type: 'AB+', units: 15, critical: false },
        { type: 'AB-', units: 3, critical: true },
    ];

    const urgentRequests = [
        { id: 1, hospital: 'City Central Hospital', blood_type: 'O-', units: 5, urgency: 'Critical' },
        { id: 2, hospital: 'St. Mary Medical Center', blood_type: 'A+', units: 3, urgency: 'High' },
        { id: 3, hospital: 'Downtown Clinic', blood_type: 'B-', units: 2, urgency: 'Medium' },
    ];

    const stats = [
        { label: 'Total Donors', value: '1,245', icon: Shield },
        { label: 'Hospitals', value: '28', icon: Database },
        { label: 'Monthly Cycle', value: '342', icon: Activity },
        { label: 'Lives Impacted', value: '5,680', icon: Hash, primary: true },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-10">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> System Overview
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Node Status</h1>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-tight">Real-time blood bridge and infrastructure monitoring.</p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} className="border-border bg-white shadow-none rounded-none overflow-hidden group">
                                <CardContent className="flex flex-col p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {stat.label}
                                        </p>
                                        <Icon size={14} className={stat.primary ? "text-indigo-600" : "text-gray-400"} />
                                    </div>
                                    <p className={`text-4xl font-black tracking-tighter ${stat.primary ? 'text-indigo-600' : 'text-gray-900'}`}>{stat.value}</p>
                                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-green-600 font-black uppercase tracking-widest">
                                        <span className="h-1 w-1 bg-green-500" />
                                        Optimal Flow
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Primary Data Surface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inventory Surface */}
                    <div className="lg:col-span-2">
                        <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                            <CardHeader className="border-b border-border bg-gray-50/50 py-4 px-6">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                    <Database size={14} /> Biological Inventory Status
                                </CardTitle>
                            </CardHeader>
                            <Table>
                                <TableHeader className="bg-gray-50/30">
                                    <TableRow className="border-b border-border">
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 px-6 w-[150px]">BAND</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">AVAILABLE VOLUME</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-right pr-6">SYSTEM STATUS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bloodInventory.map((item) => (
                                        <TableRow key={item.type} className="border-b border-border hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-black text-indigo-600 text-xl tracking-tighter px-6 py-4">{item.type}</TableCell>
                                            <TableCell className="text-sm font-black text-gray-900">{item.units} <span className="text-gray-400 font-bold ml-1 uppercase text-[10px]">Units</span></TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-none px-3 py-0.5 font-black text-[9px] uppercase tracking-widest ${item.critical
                                                            ? "border-red-200 bg-red-50 text-red-700"
                                                            : "border-green-200 bg-green-50 text-green-700"
                                                        }`}
                                                >
                                                    {item.critical ? "Critical Load" : "Optimal"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>

                    {/* Operational Directives */}
                    <div>
                        <Card className="h-full border-border bg-white shadow-none rounded-none overflow-hidden">
                            <CardHeader className="border-b border-border bg-gray-50/50 py-4 px-6">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                    <AlertTriangle size={14} className="text-red-500" /> Critical Directives
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {urgentRequests.map((req) => (
                                        <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-900 text-xs uppercase tracking-tight">{req.hospital}</h4>
                                                <Badge
                                                    variant="outline"
                                                    className={`rounded-none px-2 py-0.5 font-black text-[8px] uppercase tracking-widest ${req.urgency === 'Critical'
                                                            ? 'border-red-200 bg-red-50 text-red-700'
                                                            : 'border-orange-200 bg-orange-50 text-orange-700'
                                                        }`}
                                                >
                                                    {req.urgency}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-black text-gray-900">
                                                LOAD: <span className="text-indigo-600">{req.blood_type}</span> <span className="text-gray-400 mx-2">|</span> {req.units} UNITS
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 border-t border-border bg-gray-50/30">
                                    <Button
                                        asChild
                                        className="w-full bg-gray-900 hover:bg-black text-white rounded-none font-black text-[10px] uppercase tracking-widest h-11 flex items-center gap-2"
                                    >
                                        <Link href="/admin/requests">
                                            Review All Directives <ChevronRight size={14} />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

