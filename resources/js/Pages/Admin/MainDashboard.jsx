import AdminLayout from '@/Layouts/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Activity, Clock, Shield, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MainDashboard({ stats, requests }) {
    return (
        <AdminLayout>
            <div className="mb-8 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                    Infrastructure <ChevronRight size={10} /> Dashboard
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Main Dashboard</h2>
                <p className="text-sm text-gray-500 font-medium">Real-time biological data flow and infrastructure status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card className="border-border bg-white shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Requests</p>
                            <Activity size={14} className="text-indigo-500" />
                        </div>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalRequests}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                            <span className="h-1 w-1 bg-green-500 rounded-none" />
                            Stable Network
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-white shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Donors</p>
                            <Shield size={14} className="text-indigo-500" />
                        </div>
                        <p className="text-4xl font-black text-indigo-600 tracking-tighter">{stats.totalDonors}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                            <span className="h-1 w-1 bg-indigo-500 rounded-none" />
                            Synchronized
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-white shadow-none">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgent Alerts</p>
                            <AlertTriangle size={14} className="text-red-500" />
                        </div>
                        <p className="text-4xl font-black text-red-600 tracking-tighter">{stats.pendingRequests}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-red-600 font-bold">
                            <span className="h-1 w-1 bg-red-500 rounded-none animate-pulse" />
                            Attention Required
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border bg-white shadow-none">
                    <CardContent className="pt-6 text-center flex flex-col items-center justify-center h-full">
                        <div className="h-10 w-10 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-2">
                            <Activity size={20} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health</p>
                        <p className="text-xl font-bold text-gray-900">100%</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-white shadow-none overflow-hidden">
                <CardHeader className="border-b border-border bg-gray-50/50 py-4 px-6">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
                        <Clock size={14} /> Recent Biological Transmissions
                    </CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader className="bg-gray-50/30">
                        <TableRow className="border-b border-border">
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 px-6">HOSPITAL NODE</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">BIOLOGICAL GROUP</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">URGENCY MODULE</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-right pr-6">SYSTEM STATUS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((reg) => (
                            <TableRow key={reg.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                                <TableCell className="font-bold text-gray-900 px-6 py-4">{reg.hospital_name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-black text-[10px] px-2 border-indigo-200 text-indigo-700 bg-indigo-50">
                                        {reg.blood_type}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "capitalize font-bold text-[10px] border-none shadow-none",
                                            reg.urgency === 'critical' ? 'text-red-600 bg-red-50' : 'text-yellow-700 bg-yellow-50'
                                        )}
                                    >
                                        {reg.urgency}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-none",
                                            reg.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'
                                        )} />
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{reg.status}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </AdminLayout>
    );
}
