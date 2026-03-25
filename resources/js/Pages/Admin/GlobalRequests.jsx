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

export default function GlobalRequests({ auth }) {
    const [filterStatus, setFilterStatus] = useState("all");

    const requests = [
        { id: 1, hospital_name: 'City Central Hospital', blood_type: 'O-', units_required: 5, units_fulfilled: 2, urgency: 'critical', posted: '2 hours ago' },
        { id: 2, hospital_name: 'St. Mary Medical Center', blood_type: 'A+', units_required: 3, units_fulfilled: 3, urgency: 'urgent', posted: '5 hours ago' },
        { id: 3, hospital_name: 'Downtown Clinic', blood_type: 'B+', units_required: 2, units_fulfilled: 0, urgency: 'normal', posted: '1 day ago' },
        { id: 4, hospital_name: 'General Hospital', blood_type: 'AB-', units_required: 1, units_fulfilled: 1, urgency: 'critical', posted: '1 day ago' },
        { id: 5, hospital_name: 'Medical Center', blood_type: 'O+', units_required: 4, units_fulfilled: 4, urgency: 'urgent', posted: '2 days ago' },
    ];

    const filtered = filterStatus === "all"
        ? requests
        : requests.filter(req => req.urgency === filterStatus);

    return (
        <AdminLayout>
            <Head title="Global Blood Requests" />

            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                            Infrastructure <ChevronRight size={10} /> Network Demands
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Active Request Flow</h2>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-tight">Monitoring hospital-to-grid biological requisitions.</p>
                    </div>
                </div>

                {/* Search & Filter Matrix */}
                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                    <CardContent className="p-6 flex flex-wrap gap-6 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Network Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <Input
                                    placeholder="Search hospital node..."
                                    className="pl-9 h-10 bg-gray-50/50 border-border focus:bg-white rounded-none shadow-none text-xs font-bold"
                                />
                            </div>
                        </div>
                        <div className="w-[240px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Urgency Protocol</label>
                            <Select
                                value={filterStatus}
                                onValueChange={setFilterStatus}
                            >
                                <SelectTrigger className="h-10 bg-gray-50/50 border-border rounded-none shadow-none text-xs font-bold">
                                    <SelectValue placeholder="All Protcols" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-border shadow-none">
                                    <SelectItem value="all">ALL_PROTOCOLS</SelectItem>
                                    <SelectItem value="critical">CRITICAL_ONLY</SelectItem>
                                    <SelectItem value="urgent">URGENT_ONLY</SelectItem>
                                    <SelectItem value="normal">NORMAL_PRIORITY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            className="h-10 px-6 font-black text-[10px] uppercase tracking-widest rounded-none border-border hover:bg-gray-50"
                            onClick={() => setFilterStatus("all")}
                        >
                            Reset System
                        </Button>
                    </CardContent>
                </Card>

                {/* Records Table */}
                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50 border-b border-border">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest px-8 h-12">Hospital_Node</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-center">Band</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-center">Volume</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Sync_Status</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-center">Priority</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12">Serial_TS</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-right pr-8">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((req) => (
                                <TableRow key={req.id} className="border-border hover:bg-gray-50 transition-colors duration-200">
                                    <TableCell className="font-black text-gray-900 px-8 py-5 text-xs uppercase tracking-tight">{req.hospital_name}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-black text-xs text-indigo-600">{req.blood_type}</span>
                                    </TableCell>
                                    <TableCell className="text-center font-black text-gray-900 text-xs">
                                        {req.units_required} <span className="text-gray-400 font-bold ml-1 uppercase text-[10px]">U</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5 min-w-[100px]">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-indigo-600">{req.units_fulfilled}</span>
                                                <span className="text-gray-300">/</span>
                                                <span className="text-gray-900">{req.units_required}</span>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-none overflow-hidden border border-gray-200/50">
                                                <div
                                                    className="h-full bg-indigo-600 rounded-none"
                                                    style={{ width: `${(req.units_fulfilled / req.units_required) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-none px-2 py-0.5 font-black text-[8px] uppercase tracking-widest ${req.urgency === 'critical'
                                                    ? 'border-red-200 bg-red-50 text-red-700'
                                                    : 'border-orange-200 bg-orange-50 text-orange-700'
                                                }`}
                                        >
                                            {req.urgency}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{req.posted}</TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-4 rounded-none border-border font-black text-[9px] uppercase tracking-widest hover:bg-gray-50 shadow-none flex items-center gap-2"
                                        >
                                            Inspect <ArrowRight size={12} />
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
                        { label: 'CRITICAL_LOAD', value: requests.filter(r => r.urgency === 'critical').length, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                        { label: 'URGENT_PHASE', value: requests.filter(r => r.urgency === 'urgent').length, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
                        { label: 'NORMAL_SEQ', value: requests.filter(r => r.urgency === 'normal').length, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
                        { label: 'TOTAL_FLOW', value: requests.length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' }
                    ].map((stat, i) => (
                        <Card key={i} className={`shadow-none rounded-none border ${stat.border} ${stat.bg}`}>
                            <CardContent className="p-6">
                                <p className={`text-[10px] font-black tracking-widest uppercase ${stat.color}`}>{stat.label}</p>
                                <p className={`text-5xl font-black mt-2 tracking-tighter ${stat.color}`}>
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

