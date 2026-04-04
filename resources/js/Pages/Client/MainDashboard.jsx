import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { 
    Plus, Activity, Heart, Shield, ChevronRight, 
    Hash, Database, TrendingUp, BarChart3, 
    AlertCircle, Clock, CheckCircle2, Droplets,
    ArrowUpRight, Users, PieChart as PieChartIcon
} from "lucide-react";
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { BloodTypeDistribution } from "@/Components/Charts";

export default function ClientMainDashboard({ auth, hospitalStats, recentRequests, bloodInventory }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        blood_type: '',
        units_required: 1,
        urgency_level: 'medium',
        patient_name: '',
        contact_person: auth.user.name,
        contact_phone: auth.user.phone || '',
        reason: '',
    });

    const [liveHospitalStats, setLiveHospitalStats] = useState(hospitalStats);
    const [liveInventory, setLiveInventory] = useState(bloodInventory);

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const submitRequest = (e) => {
        e.preventDefault();
        post(route('requests.store'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Failed to create request. Please check the form.');
            }
        });
    };

    useEffect(() => {
        axios.get('/api/hospital-stats')
            .then(response => setLiveHospitalStats(response.data))
            .catch(() => {});

        axios.get('/api/hospital-inventory')
            .then(response => setLiveInventory(response.data))
            .catch(() => {});
    }, []);

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-2 bg-red-50 w-fit px-3 py-1 rounded-full">
                            <Activity size={14} /> Hospital Node
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {auth.user.hospital_name || 'Hospital Dashboard'}
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">Monitoring blood supply and urgent requests across the network.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 h-12 font-bold shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} /> Create Urgent Request
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Hospital Dashboard" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Requests', value: liveHospitalStats.totalRequests, icon: Hash, color: 'blue' },
                        { label: 'Pending', value: liveHospitalStats.pendingRequests, icon: Clock, color: 'orange' },
                        { label: 'Fulfilled', value: liveHospitalStats.fulfilledRequests, icon: CheckCircle2, color: 'green' },
                        { label: 'Units Requested', value: liveHospitalStats.totalUnitsRequested, icon: Droplets, color: 'red' },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={item}>
                            <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <CardContent className="p-8">
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                        stat.color === 'blue' && "bg-blue-50 text-blue-600",
                                        stat.color === 'orange' && "bg-orange-50 text-orange-600",
                                        stat.color === 'green' && "bg-green-50 text-green-600",
                                        stat.color === 'red' && "bg-red-50 text-red-600",
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={item} className="lg:col-span-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <Database className="text-red-600" /> Live Inventory Status
                            </h3>
                            <Link href={route('inventory')} className="text-red-600 font-bold text-sm hover:underline">
                                Manage Supply
                            </Link>
                        </div>
                        
                        <div className="flex flex-col gap-6">
                            <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] p-6 sm:p-10">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                                    <PieChartIcon size={14} /> Global Stock Distribution
                                </h4>
                                <div className="h-[250px] sm:h-[300px] w-full">
                                    {liveInventory && liveInventory.length > 0 ? (
                                        <BloodTypeDistribution 
                                            data={liveInventory.map(item => ({ name: item.blood_type, value: item.available }))} 
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                                            No inventory data available
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {(liveInventory && liveInventory.length > 0 ? liveInventory : bloodInventory).slice(0, 8).map((item, i) => (
                                    <Card key={i} className="border-none bg-white shadow-md rounded-[2rem] p-4 sm:p-6 hover:shadow-lg transition-all group border border-transparent hover:border-red-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={cn(
                                                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base transition-colors",
                                                item.status === 'critical' ? "bg-red-50 text-red-600" : 
                                                item.status === 'low' ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                                            )}>
                                                {item.blood_type}
                                            </span>
                                            <Badge className={cn(
                                                "rounded-full px-2 py-0 text-[8px] sm:text-[10px] font-bold uppercase border-none",
                                                item.status === 'critical' ? "bg-red-100 text-red-600" : 
                                                item.status === 'low' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                            )}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <p className="text-2xl sm:text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                                            {item.available} <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">units</span>
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="lg:col-span-4 space-y-6 overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-4">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <Activity className="text-blue-600" /> Recent Requests
                            </h3>
                            <Link href={route('requests.available')} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                                View History <ArrowUpRight size={16} />
                            </Link>
                        </div>

                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-x-auto">
                            <div className="min-w-[400px] lg:min-w-0">
                                <Table>
                                    <TableHeader className="bg-gray-50/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-4 sm:p-6">Blood Type</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-4 sm:p-6">Urgency</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-4 sm:p-6">Status</TableHead>
                                            <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-4 sm:p-6 text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentRequests.map((request) => (
                                            <TableRow key={request.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="p-4 sm:p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-red-50 text-red-600 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-xs sm:text-base">
                                                            {request.blood_type}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 text-xs sm:text-sm">{request.units_required} Units</p>
                                                            <p className="text-[10px] sm:text-xs text-gray-400">{new Date(request.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 sm:p-6">
                                                    <Badge className={cn(
                                                        "rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-bold uppercase border-none",
                                                        request.urgency_level === 'critical' ? "bg-red-100 text-red-700 shadow-sm shadow-red-50" : 
                                                        request.urgency_level === 'high' ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                                                    )}>
                                                        {request.urgency_level}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="p-4 sm:p-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full",
                                                            request.status === 'pending' ? "bg-orange-400 animate-pulse" : "bg-green-500"
                                                        )} />
                                                        <span className="text-[10px] sm:text-sm font-bold text-gray-700 uppercase tracking-tighter">{request.status}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-4 sm:p-6 text-right">
                                                    <Button variant="ghost" size="sm" className="rounded-full font-bold text-red-600 hover:bg-red-50 text-[10px] sm:text-xs h-8 px-2 sm:px-4">
                                                        Manage
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-red-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Droplets size={120} />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tight">Broadcast Request</DialogTitle>
                        <DialogDescription className="text-red-100 mt-2 font-medium">
                            Alert local donors about an urgent need for blood.
                        </DialogDescription>
                    </div>
                    
                    <form onSubmit={submitRequest} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Blood Type</Label>
                                <Select value={data.blood_type} onValueChange={(val) => setData('blood_type', val)}>
                                    <SelectTrigger className="rounded-2xl border-gray-100 bg-gray-50 h-12 font-bold focus:ring-red-500">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-gray-100 shadow-xl">
                                        {bloodTypes.map(type => (
                                            <SelectItem key={type} value={type} className="rounded-xl focus:bg-red-50 focus:text-red-600 font-bold">{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Units Required</Label>
                                <Input 
                                    type="number" 
                                    min="1" 
                                    max="20"
                                    value={data.units_required}
                                    onChange={e => setData('units_required', e.target.value)}
                                    className="h-12 bg-gray-50/50 border-none rounded-2xl font-bold focus:ring-red-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Urgency Level</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {['low', 'medium', 'high', 'critical'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setData('urgency_level', level)}
                                        className={cn(
                                            "py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                            data.urgency_level === level 
                                                ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-200 scale-105" 
                                                : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                                        )}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Patient Name (Optional)</Label>
                            <Input 
                                placeholder="Emergency Case #..."
                                value={data.patient_name}
                                onChange={e => setData('patient_name', e.target.value)}
                                className="rounded-2xl border-gray-100 bg-gray-50 h-12 font-bold focus:ring-red-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">Reason / Clinical Notes</Label>
                            <Textarea 
                                placeholder="Describe the medical emergency..."
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                className="rounded-2xl border-gray-100 bg-gray-50 min-h-[100px] font-medium focus:ring-red-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsOpen(false)}
                                className="flex-1 rounded-full h-12 font-bold text-gray-500 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={processing || !data.blood_type}
                                className="flex-1 rounded-full h-12 font-black bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                            >
                                {processing ? 'Broadcasting...' : 'Broadcast Request'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
