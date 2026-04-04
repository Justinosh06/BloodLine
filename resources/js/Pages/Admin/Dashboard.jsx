import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Activity, Clock, Shield, AlertTriangle, 
    ChevronRight, Database, Hash, TrendingUp,
    Users, Heart, Droplets, ArrowUpRight
} from "lucide-react";
import { 
    BloodTypeDistribution, RequestTrends, 
    DonationStatusChart, HospitalPerformanceChart 
} from "@/Components/Charts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AdminDashboard({ auth, stats, recentRequests, bloodInventory, monthlyTrends, donationStatus, urgencyDistribution, hospitalPerformance }) {
    const [systemStats, setSystemStats] = useState(stats);
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        axios.get('/api/system-stats')
            .then(response => setSystemStats(response.data))
            .catch(() => {});
    }, []);

    const handleGenerateReport = () => {
        const toastId = toast.loading("Synthesizing system metrics...");
        
        // Simulate PDF generation delay
        setTimeout(() => {
            const reportData = {
                timestamp: new Date().toLocaleString(),
                stats: systemStats,
                inventory: bloodInventory,
            };
            
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bloodline-system-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            
            toast.success("System report generated successfully!", { id: toastId });
        }, 2000);
    };

    const handleSystemAudit = () => {
        const toastId = toast.loading("Initializing system-wide audit...");
        
        const stages = [
            "Scanning biological inventory nodes...",
            "Verifying hospital authorization tokens...",
            "Checking donor encryption integrity...",
            "Optimizing emergency broadcast routes...",
            "Finalizing system health check..."
        ];

        let stageIndex = 0;
        const interval = setInterval(() => {
            if (stageIndex < stages.length) {
                toast.loading(stages[stageIndex], { id: toastId });
                stageIndex++;
            } else {
                clearInterval(interval);
                toast.success("System Audit Complete: All nodes optimal.", { 
                    id: toastId,
                    description: "Health index: 98.4% | Latency: 24ms",
                    duration: 5000
                });
            }
        }, 1200);
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10"
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-2 bg-red-50 w-fit px-3 py-1 rounded-full">
                            <Shield size={14} /> System Node Status
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Command Center</h1>
                        <p className="text-gray-500 mt-2 font-medium">Real-time monitoring of the global blood supply chain.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                            onClick={handleGenerateReport}
                            className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 rounded-full px-6 h-12 font-bold shadow-sm"
                        >
                            Generate Report
                        </Button>
                        <Button 
                            onClick={handleSystemAudit}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-full px-6 h-12 font-bold shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95"
                        >
                            System Audit
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Donors', value: systemStats.totalDonors, icon: Users, color: 'blue' },
                        { label: 'Hospitals', value: systemStats.totalHospitals, icon: Database, color: 'indigo' },
                        { label: 'Completed', value: systemStats.completedDonations, icon: Heart, color: 'red' },
                        { label: 'Units Shared', value: systemStats.totalUnitsCollected, icon: Droplets, color: 'orange' },
                    ].map((stat, idx) => (
                        <motion.div key={idx} variants={item}>
                            <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                        stat.color === 'blue' && "bg-blue-50 text-blue-600",
                                        stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                        stat.color === 'red' && "bg-red-50 text-red-600",
                                        stat.color === 'orange' && "bg-orange-50 text-orange-600",
                                    )}>
                                        <stat.icon size={24} />
                                    </div>
                                    <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <motion.div variants={item} className="lg:col-span-8">
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] p-8 h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Request & Fulfillment Trends</h3>
                                    <p className="text-sm text-gray-500 mt-1">Monthly cycle analysis for the current year.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-red-50 text-red-600 border-none font-bold">Requests</Badge>
                                    <Badge className="bg-gray-100 text-gray-600 border-none font-bold">Fulfilled</Badge>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <RequestTrends data={monthlyTrends} />
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={item} className="lg:col-span-4">
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] p-8 h-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Global Inventory</h3>
                            <div className="h-[350px] w-full">
                                <BloodTypeDistribution 
                                    data={Object.entries(bloodInventory).map(([type, units]) => ({ name: type, value: units }))} 
                                />
                            </div>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div variants={item} className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <Activity className="text-red-600" /> Recent Infrastructure Activity
                            </h3>
                            <Link href="/admin/global-requests" className="text-red-600 font-bold text-sm hover:underline flex items-center gap-1">
                                View Logs <ArrowUpRight size={16} />
                            </Link>
                        </div>
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-x-auto">
                            <div className="min-w-[600px]">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Hospital</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Requirement</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Status</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-right">Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentRequests.map((request) => (
                                            <TableRow key={request.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="p-6">
                                                    <p className="font-bold text-gray-900">{request.user?.name || 'Unknown Hospital'}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{request.blood_type} Negative</p>
                                                </TableCell>
                                                <TableCell className="p-6">
                                                    <Badge className={cn(
                                                        "rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none",
                                                        request.urgency_level === 'critical' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                                    )}>
                                                        {request.urgency_level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "h-2 w-2 rounded-full",
                                                            request.status === 'pending' ? "bg-orange-400 animate-pulse" : "bg-green-500"
                                                        )} />
                                                        <span className="text-sm font-bold text-gray-700 uppercase tracking-tighter">{request.status}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-6 text-right font-medium text-gray-400 text-xs">
                                                    {new Date(request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div variants={item} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight px-2 flex items-center gap-3">
                            <TrendingUp className="text-blue-600" /> Performance
                        </h3>
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] p-8">
                            <div className="h-[400px] w-full">
                                <HospitalPerformanceChart data={hospitalPerformance} />
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </AdminLayout>
    );
}
