import { useState, useMemo } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, MapPin, Clock, Hash, Heart, Zap, 
    ChevronRight, Users, Calendar, Phone, Filter, 
    X, CheckCircle2, AlertCircle, Droplets 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { cn } from "@/lib/utils";

export default function AvailableRequests({ auth, requests }) {
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedDonations, setSelectedDonations] = useState([]);

    const { data, setData, post, processing } = useForm({
        blood_request_id: '',
        donation_session: '',
        donation_date: '',
        units_donated: 1,
    });

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const filtered = useMemo(() => {
        return requests.filter(req => {
            const matchesBloodType = filterBloodType === "all" || req.blood_type === filterBloodType;
            const hospitalName = req.user?.hospital_name || req.hospital || "Unknown Hospital";
            const matchesSearch = hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                req.blood_type.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesBloodType && matchesSearch;
        });
    }, [requests, filterBloodType, searchQuery]);

    const openRegistrationModal = (request) => {
        setSelectedRequest(request);
        setData('blood_request_id', request.id);
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setData('donation_date', tomorrow.toISOString().split('T')[0]);
        setShowRegistrationModal(true);
    };

    const handleRegisterDonation = (e) => {
        e.preventDefault();
        if (!data.donation_session) {
            toast.error("Please select a donation session.");
            return;
        }
        if (!data.donation_date) {
            toast.error("Please select a donation date.");
            return;
        }
        
        post(route('donations.register'), {
            onSuccess: () => {
                setShowRegistrationModal(false);
                setData({
                    blood_request_id: '',
                    donation_session: '',
                    donation_date: '',
                    units_donated: 1,
                });
            },
            onError: (errors) => {
                // Error toast is shown via flash message from backend
                console.error('Registration failed:', errors);
            }
        });
    };

    const openDonorModal = (request) => {
        setSelectedRequest(request);
        setSelectedDonations(request.donations || []);
        setShowDonorModal(true);
    };

    const handleUpdateDonationStatus = (donation, status) => {
        router.post(route('donations.update-status'), {
            donation_id: donation.id,
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Donation status updated to ${status}`);
                setShowDonorModal(false);
                router.reload({ only: ['requests'] });
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to update status.');
            }
        });
    };

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
                            <Zap size={14} /> Network Status
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {auth.user.role === 'donor' ? 'Available Requests' : 'Your Broadcasts'}
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            {auth.user.role === 'donor' 
                                ? 'Find urgent blood needs matching your biological profile.' 
                                : 'Monitor and manage your active emergency requests.'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Blood Requests" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10"
            >
                {/* Donor Blood Type Notice */}
                {auth.user.role === 'donor' && (
                    <motion.div variants={item}>
                        <Card className="border-none bg-indigo-600 text-white shadow-xl shadow-indigo-100 rounded-[2rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Heart size={120} />
                            </div>
                            <CardContent className="p-8 flex items-center gap-6 relative z-10">
                                <div className="h-20 w-20 bg-white/20 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/30 shadow-inner">
                                    <span className="text-3xl font-black text-white">{auth.user.blood_type}</span>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">Your Profile: {auth.user.blood_type} Group</p>
                                    <p className="text-indigo-100 mt-1 font-medium">
                                        We've automatically filtered requests to show only those compatible with your blood type.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Filter Matrix */}
                <motion.div variants={item}>
                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-8 flex flex-wrap gap-6 items-end">
                            <div className="flex-1 min-w-[300px] space-y-3">
                                <label className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-2">
                                    <Search size={14} className="text-gray-400" /> Search Network
                                </label>
                                <div className="relative group">
                                    <Input
                                        placeholder={auth.user.role === 'donor' ? 'Search by hospital or blood type...' : 'Search your broadcasts...'}
                                        className="h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all pl-6"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {auth.user.role !== 'donor' && (
                                <div className="w-[240px] space-y-3">
                                    <label className="text-xs font-bold text-gray-700 ml-1 flex items-center gap-2">
                                        <Filter size={14} className="text-gray-400" /> Blood Group
                                    </label>
                                    <Select
                                        value={filterBloodType}
                                        onValueChange={setFilterBloodType}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50/50 border-none rounded-2xl shadow-none text-sm font-bold">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="all" className="rounded-xl font-bold">All Groups</SelectItem>
                                            {bloodTypes.map((type) => (
                                                <SelectItem key={type} value={type} className="rounded-xl font-bold focus:bg-red-50 focus:text-red-600">
                                                    {type} Group
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                className="h-12 px-8 font-bold text-sm rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                onClick={() => {
                                    setFilterBloodType("all");
                                    setSearchQuery("");
                                }}
                            >
                                Reset System
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Grid Display */}
                <div className="grid grid-cols-1 gap-6 pb-20">
                    <AnimatePresence mode="popLayout">
                        {filtered.length > 0 ? (
                            filtered.map((req) => (
                                <motion.div 
                                    key={req.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border-l-8 border-l-transparent hover:border-l-red-600">
                                        <CardContent className="p-8">
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-16 w-16 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                                                            {req.blood_type}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                                                    {req.user?.hospital_name || req.hospital || "Unknown Hospital"}
                                                                </h3>
                                                                <Badge className={cn(
                                                                    "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm",
                                                                    req.urgency_level?.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700 shadow-red-50' :
                                                                    req.urgency_level?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                                )}>
                                                                    {req.urgency_level || req.urgency || 'Normal'}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-gray-400 text-xs mt-1.5 font-bold">
                                                                <span className="flex items-center gap-1.5"><Clock size={14} /> {req.posted || 'Recent'}</span>
                                                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {req.user?.address || 'Regional Network'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {req.reason && (
                                                        <p className="text-gray-500 text-sm font-medium leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100 italic">
                                                            "{req.reason}"
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-64">
                                                    <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center border border-gray-100">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requirement</span>
                                                        <span className="text-xl font-black text-gray-900">{req.units_required || req.units} <span className="text-xs uppercase text-gray-400">Units</span></span>
                                                    </div>

                                                    {auth.user.role === 'donor' ? (
                                                        req.donations && req.donations.some(d => d.donor_id === auth.user.id) ? (
                                                            <Button
                                                                disabled
                                                                className="h-14 rounded-full bg-green-50 text-green-600 font-bold border-none shadow-none flex items-center gap-2"
                                                            >
                                                                <CheckCircle2 size={18} /> Registered
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="h-14 rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                                                onClick={() => openRegistrationModal(req)}
                                                                disabled={processing}
                                                            >
                                                                <Heart size={18} className="fill-current" /> Sign Up to Donate
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            className="h-14 rounded-full border-2 border-gray-100 font-bold text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
                                                            onClick={() => openDonorModal(req)}
                                                        >
                                                            <Users size={18} />
                                                            Manage Donors ({req.donations?.length || 0})
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="py-32 text-center"
                            >
                                <div className="h-24 w-24 bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-200">
                                    <AlertCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">No broadcasts detected</h3>
                                <p className="text-gray-500 mt-2 font-medium max-w-md mx-auto">
                                    We couldn't find any active blood requests matching your current filters.
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-6 text-red-600 font-bold hover:underline"
                                    onClick={() => {
                                        setFilterBloodType("all");
                                        setSearchQuery("");
                                    }}
                                >
                                    Reset all filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Registration Modal */}
            <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-red-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Heart size={120} />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <Droplets className="fill-current" /> Confirm Donation
                        </DialogTitle>
                        <DialogDescription className="text-red-100 mt-2 font-medium">
                            You are registering to donate 1 unit of blood.
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleRegisterDonation} className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hospital</span>
                                <span className="text-sm font-bold text-gray-900">{selectedRequest?.user?.hospital_name || selectedRequest?.hospital}</span>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Preferred Date</label>
                                <Input
                                    type="date"
                                    value={data.donation_date}
                                    onChange={(e) => setData('donation_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="h-12 bg-gray-50/50 border-none rounded-2xl font-bold focus:ring-red-500"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Preferred Session</label>
                                <Select 
                                    value={data.donation_session} 
                                    onValueChange={(val) => setData('donation_session', val)}
                                >
                                    <SelectTrigger className="h-12 bg-gray-50/50 border-none rounded-2xl font-bold focus:ring-red-500">
                                        <SelectValue placeholder="Select session..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="morning" className="rounded-xl font-bold">Morning (9AM - 12PM)</SelectItem>
                                        <SelectItem value="afternoon" className="rounded-xl font-bold">Afternoon (1PM - 5PM)</SelectItem>
                                        <SelectItem value="evening" className="rounded-xl font-bold">Evening (6PM - 9PM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="flex-1 h-12 rounded-full font-bold text-gray-500 hover:bg-gray-50" 
                                onClick={() => setShowRegistrationModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={processing}
                                className="flex-1 h-12 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-red-700 shadow-lg shadow-red-100"
                            >
                                {processing ? "Registering..." : "Confirm"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Donor Management Modal */}
            <Dialog open={showDonorModal} onOpenChange={setShowDonorModal}>
                <DialogContent className="max-w-3xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Users size={120} />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight">Manage Registrations</DialogTitle>
                        <DialogDescription className="text-indigo-100 mt-2 font-medium">
                            Review and update the status of donor registrations.
                        </DialogDescription>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                        {selectedDonations.length > 0 ? (
                            selectedDonations.map((donation) => (
                                <div key={donation.id} className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 group">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm">
                                                <AvatarImage src={`https://avatar.vercel.sh/${donation.donor.name}.png`} />
                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
                                                    {donation.donor.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{donation.donor.name}</h4>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium mt-1">
                                                    <span className="flex items-center gap-1.5"><Phone size={12} /> {donation.donor.phone}</span>
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(donation.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className={cn(
                                            "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest border-none",
                                            donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            donation.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        )}>
                                            {donation.status}
                                        </Badge>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200/50 flex flex-wrap gap-2">
                                        {['scheduled', 'in_progress', 'completed', 'cancelled'].map(status => (
                                            <Button
                                                key={status}
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "rounded-full px-4 font-bold text-[10px] uppercase tracking-widest transition-all",
                                                    donation.status === status 
                                                        ? "bg-gray-900 text-white hover:bg-gray-900" 
                                                        : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                                                )}
                                                onClick={() => handleUpdateDonationStatus(donation, status)}
                                                disabled={processing}
                                            >
                                                {status.replace('_', ' ')}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center">
                                <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No donors have registered for this request yet.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                        <Button 
                            onClick={() => setShowDonorModal(false)}
                            className="rounded-full px-8 h-12 bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                        >
                            Close Manager
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
