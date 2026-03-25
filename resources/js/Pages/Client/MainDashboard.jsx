import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Plus, Activity, Heart, Shield, ChevronRight, Hash, Database } from "lucide-react";

export default function ClientMainDashboard({ auth, hospitalStats, recentRequests, bloodInventory }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        blood_type: '',
        units_required: '',
        urgency_level: 'normal',
        reason: 'Emergency blood request from hospital dashboard',
    });

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const submitRequest = (e) => {
        e.preventDefault();
        post(route('requests.store'), {
            onSuccess: () => {
                setIsOpen(false);
                setData({
                    blood_type: '',
                    units_required: '',
                    urgency_level: 'normal',
                    reason: 'Emergency blood request from hospital dashboard',
                });
            }
        });
    };

    const openRequestModal = (bloodType = '') => {
        setData('blood_type', bloodType);
        setIsOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> Hospital Node
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Hospital Dashboard</h2>
                        <Button
                            variant="outline"
                            className="rounded-none border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 px-6"
                            onClick={() => openRequestModal()}
                        >
                            <Plus size={14} className="mr-2" /> Create Request
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Hospital Dashboard" />

            <div className="space-y-8">
                {/* Infrastructure Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Total Requests</p>
                                <Hash size={14} className="text-indigo-500" />
                            </div>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{hospitalStats?.totalRequests || 0}</p>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                <span className="h-1 w-1 bg-green-500 rounded-none" />
                                Synchronized
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Pending</p>
                                <Activity size={14} className="text-indigo-500" />
                            </div>
                            <p className="text-4xl font-black text-indigo-600 tracking-tighter">{hospitalStats?.pendingRequests || 0}</p>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                                <span className="h-1 w-1 bg-indigo-500 rounded-none" />
                                Live Traffic
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-xs">Units Requested</p>
                                <Database size={14} className="text-indigo-500" />
                            </div>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{hospitalStats?.totalUnitsRequested || 0}</p>
                            <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                                <span className="h-1 w-1 bg-green-500 rounded-none" />
                                Active
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Modules */}
                <Tabs defaultValue="inventory" className="w-full">
                    <TabsList className="bg-white border border-border p-1 w-full justify-start rounded-none">
                        <TabsTrigger value="inventory" className="rounded-none py-2.5 px-6 text-xs font-black uppercase tracking-widest transition-all border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-gray-50">Inventory</TabsTrigger>
                        <TabsTrigger value="requests" className="rounded-none py-2.5 px-6 text-xs font-black uppercase tracking-widest transition-all border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-gray-50">Request Log</TabsTrigger>
                    </TabsList>

                    <TabsContent value="inventory" className="mt-6">
                        <Card className="border-border bg-white shadow-none overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="border-b border-border">
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 px-6">BIOLOGICAL GROUP</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest h-12 text-center">QUANTITY (UNITS)</TableHead>
                                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest h-12 pr-6">SYSTEM ACTION</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bloodInventory?.map((item) => (
                                        <TableRow key={item.blood_type} className="border-b border-border hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-black text-indigo-600 text-2xl tracking-tighter px-6 py-4">{item.blood_type}</TableCell>
                                            <TableCell className="text-center">
                                                <span className="font-bold text-gray-900 text-lg">{item.available}</span>
                                                {item.reserved > 0 && (
                                                    <span className="text-xs text-gray-500 ml-2">({item.reserved} reserved)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-none font-bold text-[10px] uppercase tracking-widest h-8 px-4 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                                                    onClick={() => openRequestModal(item.blood_type)}
                                                >
                                                    Request Blood
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="requests" className="mt-6 space-y-4">
                        {recentRequests?.map((req) => (
                            <Card key={req.id} className="border-border bg-white shadow-none px-6 py-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="h-10 w-10 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-black">
                                            {req.blood_type}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">Blood Request #{req.id}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {req.units_required} units <span className="mx-2 text-gray-200">|</span> {new Date(req.created_at).toLocaleDateString()} <span className="mx-2 text-gray-200">|</span> {req.urgency_level}
                                            </p>
                                            
                                            {/* Donor Registration Information */}
                                            {req.donor_registration ? (
                                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                                    <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">Donor Registration</p>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div>
                                                            <span className="font-medium text-blue-900">{req.donor_registration.donor_name}</span>
                                                            <span className="text-blue-700 ml-2">({req.donor_registration.donor_blood_type})</span>
                                                        </div>
                                                        <div className="text-blue-700">
                                                            Session: {req.donor_registration.donation_session}
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "rounded-none px-2 py-1 font-black text-[9px] uppercase tracking-widest",
                                                                req.donor_registration.donation_status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                req.donor_registration.donation_status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                req.donor_registration.donation_status === 'accepted' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                                'bg-gray-50 text-gray-700 border-gray-100'
                                                            )}
                                                        >
                                                            {req.donor_registration.donation_status}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Registered: {new Date(req.donor_registration.registration_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                                    <p className="text-xs font-black text-gray-600 uppercase tracking-widest">No Donor Registration</p>
                                                    <p className="text-sm text-gray-500 mt-1">Waiting for donor to register for this request.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "rounded-none px-3 py-1 font-black text-[10px] uppercase tracking-widest",
                                                req.status === 'fulfilled' ? 'bg-green-50 text-green-700 border-green-100' : 
                                                req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                            )}
                                        >
                                            {req.status}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Request Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md border-border bg-white rounded-none p-8">
                    <form onSubmit={submitRequest}>
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                                Create Blood Request
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">Request blood units for patients in need.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Type</label>
                                <Select 
                                    value={data.blood_type} 
                                    onValueChange={(val) => setData('blood_type', val)}
                                >
                                    <SelectTrigger className={`h-10 border-border bg-gray-50/50 rounded-none ${errors.blood_type ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select blood type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-border">
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="rounded-none">{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.blood_type && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.blood_type}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Units Required</label>
                                <Input 
                                    type="number" 
                                    min="1" 
                                    placeholder="Enter units..." 
                                    value={data.units_required}
                                    onChange={(e) => setData('units_required', e.target.value)}
                                    className={`h-10 border-border bg-gray-50/50 rounded-none ${errors.units_required ? 'border-red-500' : ''}`}
                                />
                                {errors.units_required && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.units_required}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency Level</label>
                                <Select 
                                    value={data.urgency_level} 
                                    onValueChange={(val) => setData('urgency_level', val)}
                                >
                                    <SelectTrigger className="h-10 border-border bg-gray-50/50 rounded-none">
                                        <SelectValue placeholder="Select urgency..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-border">
                                        <SelectItem value="critical" className="rounded-none">Critical</SelectItem>
                                        <SelectItem value="high" className="rounded-none">High</SelectItem>
                                        <SelectItem value="normal" className="rounded-none">Normal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-8 flex gap-3">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="h-10 px-6 font-bold text-gray-500 rounded-none" 
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={processing}
                                className="h-10 px-8 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-indigo-700 flex-1 shadow-none"
                            >
                                {processing ? "Creating..." : "Create Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
