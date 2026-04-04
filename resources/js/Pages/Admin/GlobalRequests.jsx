import AdminLayout from '@/Layouts/AdminLayout';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Filter, ArrowRight, ChevronRight, Activity, Clock, Zap } from "lucide-react";

export default function GlobalRequests({ requests, summary }) {
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered = filterStatus === "all"
        ? requests
        : requests.filter(req => req.urgency_level === filterStatus);

    return (
        <AdminLayout>
            <Head title="Global Blood Requests" />

            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                            Infrastructure <ChevronRight size={10} /> Network Demands
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Active Request Flow</h2>
                        <p className="text-gray-500 mt-2 font-medium">Monitoring hospital-to-grid biological requisitions in real-time.</p>
                    </div>
                </div>

                {/* Search & Filter Matrix */}
                <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex flex-wrap gap-6 items-end">
                        <div className="flex-1 min-w-[240px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Network Search</label>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    placeholder="Search hospital node..."
                                    className="pl-10 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                />
                            </div>
                        </div>
                        <div className="w-[240px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Urgency Protocol</label>
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="h-12 bg-gray-50/50 border-none rounded-2xl shadow-none text-sm font-bold">
                                    <SelectValue placeholder="All Protocols" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest">All Protocols</SelectItem>
                                    <SelectItem value="critical" className="text-xs font-bold uppercase tracking-widest text-red-600">Critical Only</SelectItem>
                                    <SelectItem value="high" className="text-xs font-bold uppercase tracking-widest text-orange-600">High Only</SelectItem>
                                    <SelectItem value="medium" className="text-xs font-bold uppercase tracking-widest text-blue-600">Medium Priority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="ghost"
                            className="h-12 px-6 font-bold text-sm rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            onClick={() => setFilterStatus("all")}
                        >
                            Reset System
                        </Button>
                    </CardContent>
                </Card>

                {/* Records Table */}
                <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Hospital Node</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-center">Band</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-center">Volume</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Sync Status</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-center">Priority</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((req) => (
                                <TableRow key={req.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group">
                                    <TableCell className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                                                <Zap size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 uppercase tracking-tight">{req.user?.name || 'Unknown Node'}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ID: {req.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center p-6">
                                        <span className="font-black text-lg text-red-600 tracking-tighter">{req.blood_type}</span>
                                    </TableCell>
                                    <TableCell className="text-center p-6">
                                        <p className="font-black text-gray-900 text-lg">{req.units_required} <span className="text-gray-400 font-bold ml-0.5 uppercase text-[10px]">U</span></p>
                                    </TableCell>
                                    <TableCell className="p-6">
                                        <div className="flex flex-col gap-2 min-w-[120px]">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-red-600">{req.units_fulfilled}</span>
                                                <span className="text-gray-300">/</span>
                                                <span className="text-gray-900">{req.units_required}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        req.status === 'fulfilled' ? "bg-green-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${(req.units_fulfilled / req.units_required) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center p-6">
                                        <Badge
                                            className={cn(
                                                "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest border-none",
                                                req.urgency_level === 'critical' ? 'bg-red-100 text-red-700' : 
                                                req.urgency_level === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                            )}
                                        >
                                            {req.urgency_level}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right p-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-indigo-600"
                                        >
                                            <ChevronRight size={20} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Metric Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Critical Load', value: summary.urgent, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
                        { label: 'Active Flow', value: summary.pending, color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
                        { label: 'Fulfilled', value: summary.fulfilled, color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
                        { label: 'Total Volume', value: summary.total, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Activity }
                    ].map((stat, i) => (
                        <Card key={i} className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <CardContent className="p-8">
                                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                    <stat.icon size={24} />
                                </div>
                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{stat.label}</p>
                                <p className={cn("text-4xl font-black mt-1 tracking-tighter", stat.color)}>
                                    {stat.value.toString().padStart(2, '0')}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

