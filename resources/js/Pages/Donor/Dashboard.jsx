import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Activity, Heart, Shield, Award, Clock, 
    ChevronRight, CheckCircle2, Calendar, 
    MapPin, AlertCircle, Droplets, ArrowUpRight,
    History as HistoryIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

import { toast } from "sonner";

export default function DonorDashboard({ auth, stats, donorStats, urgentNeeds, donationHistory, upcomingDonations }) {
    const [liveStats, setLiveStats] = useState(donorStats);
    const [liveUrgentNeeds, setLiveUrgentNeeds] = useState(urgentNeeds);

    const handleShare = () => {
        const shareText = `I've saved lives with BloodLine! I've made ${donorStats.totalDonations} donations so far. Join the network and help save lives too! #BloodLine #LifeSaver`;
        
        if (navigator.share) {
            navigator.share({
                title: 'BloodLine Achievement',
                text: shareText,
                url: window.location.origin,
            }).catch(() => {
                toast.error("Sharing failed.");
            });
        } else {
            navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
            toast.success("Achievement copied to clipboard!");
        }
    };

    useEffect(() => {
        axios.get('/api/donor-stats')
            .then(response => setLiveStats(response.data))
            .catch(() => {});

        axios.get('/api/available-requests')
            .then(response => setLiveUrgentNeeds(response.data))
            .catch(() => {});
    }, []);
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
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
                            <Activity size={14} /> Donor Portal
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back, {auth.user.name.split(' ')[0]}
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">Your contributions have saved lives. Ready for your next donation?</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('requests.available')}>
                            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 h-12 font-bold shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95">
                                <Droplets className="mr-2 h-5 w-5" /> Find Requests
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Donor Dashboard" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div variants={item}>
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-red-100/50 transition-all duration-500">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between">
                                    <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform duration-500">
                                        <Heart size={28} className="fill-red-500/20" />
                                    </div>
                                    <Badge className="bg-green-50 text-green-600 border-none px-3 py-1 rounded-full font-bold">
                                        Active
                                    </Badge>
                                </div>
                                <div className="mt-6">
                                    <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">Blood Type</p>
                                    <h3 className="text-4xl font-black text-gray-900 mt-1">{liveStats.bloodType}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between">
                                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
                                        <Award size={28} className="fill-blue-500/20" />
                                    </div>
                                    <p className="text-blue-600 font-bold text-sm">Life Saver</p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">Total Donations</p>
                                    <h3 className="text-4xl font-black text-gray-900 mt-1">{liveStats.totalDonations}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className={cn(
                            "border-none shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500",
                            liveStats.isAvailable && !liveStats.hasUpcomingDonation ? "bg-white hover:shadow-green-100/50" : "bg-gray-50"
                        )}>
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between">
                                    <div className={cn(
                                        "h-14 w-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500",
                                        liveStats.isAvailable && !liveStats.hasUpcomingDonation ? "bg-green-50 text-green-600" : 
                                        liveStats.hasUpcomingDonation ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
                                    )}>
                                        <Clock size={28} />
                                    </div>
                                    <p className={cn("font-bold text-sm", 
                                        liveStats.isAvailable && !liveStats.hasUpcomingDonation ? "text-green-600" : 
                                        liveStats.hasUpcomingDonation ? "text-blue-600" : "text-orange-600"
                                    )}>
                                        {liveStats.hasUpcomingDonation ? 'Scheduled' : 
                                         liveStats.isAvailable ? 'Ready' : 'Recovering'}
                                    </p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-gray-500 font-medium uppercase tracking-wider text-xs">Status</p>
                                    <h3 className="text-2xl font-black text-gray-900 mt-1 leading-tight">
                                        {liveStats.hasUpcomingDonation ? (
                                            liveStats.upcomingDonationDays === 0 ? 'Today' : 
                                            liveStats.upcomingDonationDays === 1 ? 'Tomorrow' :
                                            `In ${liveStats.upcomingDonationDays} days`
                                        ) : liveStats.isAvailable ? (
                                            'Eligible to Donate'
                                        ) : (
                                            (() => {
                                                const days = Math.floor(liveStats.eligibilityDays);
                                                const hours = Math.floor((liveStats.eligibilityDays - days) * 24);
                                                if (days === 0) {
                                                    return `Wait ${hours} hour${hours !== 1 ? 's' : ''}`;
                                                }
                                                return `Wait ${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
                                            })()
                                        )}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <motion.div variants={item} className="order-2 lg:order-1 lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <AlertCircle className="text-red-600" /> Urgent Needs
                            </h3>
                            <Link href={route('requests.available')} className="text-red-600 font-bold text-sm hover:underline flex items-center gap-1">
                                View all <ArrowUpRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {liveUrgentNeeds.length > 0 ? liveUrgentNeeds.map((request) => (
                                <motion.div 
                                    key={request.id}
                                    whileHover={{ x: 5 }}
                                    className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 hover:border-red-200 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-black text-xl group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                                            {request.blood_type}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-1">{request.hospital_name}</h4>
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                    <MapPin size={12} /> {request.user?.address || 'Local Hospital'}
                                                </span>
                                                <Badge className={cn(
                                                    "text-[10px] uppercase font-black px-2 py-0.5 rounded-full border-none",
                                                    request.urgency_level === 'critical' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
                                                )}>
                                                    {request.urgency_level}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={route('requests.available', { id: request.id })} className="w-full sm:w-auto">
                                        <Button variant="ghost" className="w-full sm:w-10 h-10 rounded-xl sm:rounded-full p-0 text-gray-400 group-hover:text-red-600 group-hover:bg-red-50 border border-gray-100 sm:border-none">
                                            <span className="sm:hidden mr-2 font-bold text-xs">View Details</span>
                                            <ChevronRight size={24} />
                                        </Button>
                                    </Link>
                                </motion.div>
                            )) : (
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
                                    <div className="bg-white h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4 text-gray-400">
                                        <Heart size={32} />
                                    </div>
                                    <p className="text-gray-500 font-medium">No urgent needs for your blood type right now.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="order-1 lg:order-2 lg:col-span-4 space-y-6">
                        {/* Upcoming Donations Section */}
                        {upcomingDonations.length > 0 && (
                            <>
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                        <Calendar className="text-green-600" /> Upcoming Donations
                                    </h3>
                                </div>

                                <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-gray-50">
                                            {upcomingDonations.map((donation) => (
                                                <div key={donation.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                                            <Clock size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {donation.status === 'scheduled' ? 'Scheduled' : 'In Progress'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {new Date(donation.donation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 pl-14">
                                                        <div className="bg-gray-50 rounded-xl p-3 text-xs font-medium text-gray-600 border border-gray-100">
                                                            {donation.blood_request?.user?.hospital_name || donation.blood_request?.hospital_name || 'Hospital'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <HistoryIcon className="text-blue-600" /> Recent Activity
                            </h3>
                        </div>

                        <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-hidden">
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-50">
                                    {donationHistory.length > 0 ? donationHistory.map((donation) => (
                                        <div key={donation.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Donation Completed</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {new Date(donation.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 pl-14">
                                                <div className="bg-gray-50 rounded-xl p-3 text-xs font-medium text-gray-600 border border-gray-100">
                                                    {donation.blood_request?.hospital_name || 'General Hospital'}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-10 text-center">
                                            <p className="text-gray-400 text-sm font-medium">No donation history yet.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-200 rounded-[2rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Heart size={120} />
                            </div>
                            <CardContent className="p-8 relative z-10">
                                <h4 className="text-xl font-bold">Your Impact</h4>
                                <p className="text-red-100 mt-2 text-sm leading-relaxed">
                                    Every donation can save up to 3 lives. You've potentially saved <span className="font-black text-white">{donorStats.totalDonations * 3}</span> lives so far.
                                </p>
                                <Button 
                                    onClick={handleShare}
                                    className="mt-6 bg-white text-red-600 hover:bg-red-50 rounded-full font-bold px-6"
                                >
                                    Share Achievement
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
