import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, CheckCircle, AlertCircle, ChevronRight, Droplets, MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Calendar({ donations = [], calendar, currentMonth, stats }) {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'accepted':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-3 w-3" />;
            case 'scheduled':
                return <Clock className="h-3 w-3" />;
            case 'accepted':
                return <AlertCircle className="h-3 w-3" />;
            default:
                return <Users className="h-3 w-3" />;
        }
    };

    const getSessionTime = (session) => {
        switch (session) {
            case 'morning':
                return '9:00 AM - 12:00 PM';
            case 'afternoon':
                return '1:00 PM - 5:00 PM';
            case 'evening':
                return '6:00 PM - 9:00 PM';
            default:
                return 'Not specified';
        }
    };

    const safeStats = stats || {
        totalDonations: donations.length,
        completedDonations: donations.filter((d) => d.status === "completed").length,
        scheduledDonations: donations.filter((d) => d.status === "scheduled").length,
        pendingDonations: donations.filter((d) =>
            ["pending", "accepted", "in_progress"].includes(d.status)
        ).length,
    };

    const monthLabel =
        currentMonth ||
        new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const days = Array.isArray(calendar) ? calendar : [];

    const handleDonationClick = (donation) => {
        // Find full donation details from the donations array
        const fullDonation = donations.find(d => d.id === donation.id);
        if (fullDonation) {
            setSelectedDonation(fullDonation);
            setIsModalOpen(true);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Schedule <ChevronRight size={10} /> Calendar
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Donation Calendar</h2>
                </div>
            }
        >
            <Head title="Donation Calendar" />

            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Donations</p>
                                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{safeStats.totalDonations}</p>
                                </div>
                                <Users className="h-8 w-8 text-indigo-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed</p>
                                    <p className="text-3xl font-black text-green-600 tracking-tighter">{safeStats.completedDonations}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scheduled</p>
                                    <p className="text-3xl font-black text-blue-600 tracking-tighter">{safeStats.scheduledDonations}</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border bg-white shadow-none">
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending</p>
                                    <p className="text-3xl font-black text-yellow-600 tracking-tighter">{safeStats.pendingDonations}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar */}
                <Card className="border-border bg-white shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            {monthLabel}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Week days header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day) => (
                                <div key={day} className="text-center text-xs font-black text-gray-500 uppercase tracking-widest py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day) => (
                                <div
                                    key={day.date}
                                    className={cn(
                                        "min-h-[100px] border border-border rounded p-2 transition-colors",
                                        day.isToday && "bg-indigo-50 border-indigo-200",
                                        day.isPast && "bg-gray-50",
                                        day.isWeekend && "bg-gray-50/50",
                                        !day.isPast && "hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            day.isToday && "text-indigo-600",
                                            day.isPast && "text-gray-400",
                                            !day.isPast && "text-gray-900"
                                        )}>
                                            {day.day}
                                        </span>
                                        {day.hasDonations && (
                                            <span className="text-xs bg-indigo-100 text-indigo-800 px-1 rounded">
                                                {day.donations.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Donations for this day */}
                                    <div className="space-y-1">
                                        {day.donations.slice(0, 2).map((donation) => (
                                            <div
                                                key={donation.id}
                                                onClick={() => handleDonationClick(donation)}
                                                className="text-xs p-1 rounded border cursor-pointer hover:shadow-sm transition-shadow hover:scale-105"
                                                style={{
                                                    backgroundColor: getStatusColor(donation.status).replace('text-', 'bg-').replace(' border-', '/'),
                                                    borderColor: getStatusColor(donation.status).split(' ')[2],
                                                    color: getStatusColor(donation.status).split(' ')[1]
                                                }}
                                                title={`${donation.donor.name} - ${getSessionTime(donation.time)}`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(donation.status)}
                                                    <span className="truncate font-medium">
                                                        {donation.donor.blood_type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {day.donations.length > 2 && (
                                            <div className="text-xs text-gray-500 text-center">
                                                +{day.donations.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Legend */}
                <Card className="border-border bg-white shadow-none">
                    <CardContent className="py-4">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Status Legend</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                                <span className="text-xs text-gray-600">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                                <span className="text-xs text-gray-600">Scheduled</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                                <span className="text-xs text-gray-600">Accepted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
                                <span className="text-xs text-gray-600">In Progress</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Donation Detail Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                        {selectedDonation && (
                            <>
                                <div className={cn(
                                    "p-8 text-white relative overflow-hidden",
                                    selectedDonation.status === 'completed' ? "bg-green-600" :
                                    selectedDonation.status === 'scheduled' ? "bg-blue-600" :
                                    selectedDonation.status === 'in_progress' ? "bg-purple-600" :
                                    "bg-yellow-600"
                                )}>
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Droplets size={120} />
                                    </div>
                                    <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 relative z-10">
                                        <Droplets className="fill-current" /> Donation Details
                                    </DialogTitle>
                                    <DialogDescription className="text-white/80 mt-2 font-medium relative z-10">
                                        {selectedDonation.status === 'completed' ? 'Completed Donation' :
                                         selectedDonation.status === 'scheduled' ? 'Scheduled Donation' :
                                         selectedDonation.status === 'in_progress' ? 'Donation In Progress' :
                                         'Pending Donation'}
                                    </DialogDescription>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Donor Info */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16 rounded-2xl border-2 border-gray-100">
                                            <AvatarImage src={`https://avatar.vercel.sh/${selectedDonation.donor?.name}.png`} />
                                            <AvatarFallback className="bg-gray-100 text-gray-600 font-bold text-xl">
                                                {selectedDonation.donor?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">{selectedDonation.donor?.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="rounded-full px-3 py-1 text-xs font-bold border-none bg-red-100 text-red-600">
                                                    {selectedDonation.donor?.blood_type}
                                                </Badge>
                                                <span className="text-xs text-gray-500">{selectedDonation.donor?.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <CalendarIcon size={14} /> Date
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {selectedDonation.donation_date ? new Date(selectedDonation.donation_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={14} /> Session
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {getSessionTime(selectedDonation.donation_session)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Droplets size={14} /> Units
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {selectedDonation.units_donated || 1} Unit(s)
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={14} /> Request ID
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                #{selectedDonation.blood_request_id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex justify-center">
                                        <Badge className={cn(
                                            "rounded-full px-6 py-2 text-sm font-black uppercase tracking-widest border-none",
                                            selectedDonation.status === 'completed' ? "bg-green-100 text-green-700" :
                                            selectedDonation.status === 'scheduled' ? "bg-blue-100 text-blue-700" :
                                            selectedDonation.status === 'in_progress' ? "bg-purple-100 text-purple-700" :
                                            "bg-yellow-100 text-yellow-700"
                                        )}>
                                            {selectedDonation.status?.replace('_', ' ')}
                                        </Badge>
                                    </div>

                                    <Button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full h-12 rounded-full font-bold bg-gray-900 text-white hover:bg-gray-800"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
