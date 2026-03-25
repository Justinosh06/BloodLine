import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Heart, Shield, Award, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DonorDashboard({ auth, stats, donorStats, urgentNeeds, donationHistory }) {

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> User Node
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Donor Control Panel
                    </h2>
                </div>
            }
        >
            <Head title="Donor Dashboard" />

            <main className="max-w-7xl mx-auto p-8">
                {/* Header Information */}
                <div className="flex flex-col gap-1 mb-10">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> User Node
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        Donor Control Panel
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                    {/* Identity Card */}
                    <Card className="md:col-span-4 border-border bg-white shadow-none rounded-none overflow-hidden relative group">
                        <div className="h-1.5 w-full bg-indigo-600" />
                        <CardContent className="flex flex-col items-center pt-10 px-8 pb-10">
                            <div className="relative">
                                <div className="w-32 h-32 border border-border p-1 bg-white">
                                    <Avatar className="w-full h-full rounded-none">
                                        <AvatarImage src={`https://avatar.vercel.sh/${auth.user.name}.png`} />
                                        <AvatarFallback className="bg-gray-50 text-gray-900 font-black text-2xl rounded-none">
                                            {auth.user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-indigo-600 border border-indigo-700 flex items-center justify-center text-white">
                                    <Shield size={16} />
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{auth.user.name}</h2>
                                <div className="flex flex-col items-center gap-2 mt-4">
                                    <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-black uppercase tracking-widest">
                                        <span className="h-1.5 w-1.5 bg-green-500 rounded-none" />
                                        Verified Donor
                                    </div>
                                    <div className="text-xl font-black text-gray-900 mt-1">
                                        Blood Type <span className="text-red-600">{auth.user.blood_type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full mt-10 space-y-6 pt-10 border-t border-border">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Donations</p>
                                        <p className="font-black text-gray-900 mt-1 uppercase text-sm tracking-tight">{donorStats.totalDonations}</p>
                                    </div>
                                    <p className="text-lg font-black text-gray-900 tracking-tighter">{donorStats.totalDonations}</p>
                                </div>
                                <Progress
                                    value={Math.min(donorStats.totalDonations * 10, 100)}
                                    className="h-1.5 rounded-none bg-gray-100"
                                />
                                <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>Level</span>
                                    <span>Life Saver</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Donation Status */}
                    <div className="md:col-span-8 flex flex-col gap-8">
                        <Card className="border-border bg-white shadow-none rounded-none overflow-hidden h-full">
                            <div className="bg-gray-50/50 border-b border-border py-4 px-8 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                                    <Heart size={12} /> Donation Status
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase">
                                    {donorStats.isAvailable ? 'Available to Donate' : 'Recovery Period'}
                                </div>
                            </div>
                            <CardContent className="py-10 px-10 flex flex-col justify-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    {donorStats.isAvailable ? 'Ready to Save Lives' : 'Next Eligibility Date'}
                                </p>
                                <p className="text-6xl font-black tracking-tighter text-gray-900">
                                    {donorStats.isAvailable ? 'Available' : `${donorStats.eligibilityDays} Days`}
                                </p>

                                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="border border-border p-5 bg-gray-50/20">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Last Donation</p>
                                        <p className="text-xl font-black text-gray-900 mt-1 uppercase tracking-tight">
                                            {donorStats.lastDonation ? new Date(donorStats.lastDonation).toLocaleDateString() : 'No donations yet'}
                                        </p>
                                    </div>
                                    <div className="border border-border p-5 bg-gray-50/20">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Lives Saved</p>
                                        <p className="text-xl font-black text-gray-900 mt-1 uppercase tracking-tight">{donorStats.totalDonations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <Card className="border-border bg-white shadow-none rounded-none group h-full">
                                <CardContent className="py-6 px-8 flex flex-row items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Registrations</p>
                                        <p className="text-4xl font-black text-gray-900 tracking-tighter mt-1">
                                            {stats.activeRequests}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 border border-border flex items-center justify-center text-indigo-600">
                                        <Heart size={20} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-border bg-white shadow-none rounded-none group h-full">
                                <CardContent className="py-6 px-8 flex flex-row items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgent Needs</p>
                                        <p className="text-4xl font-black text-gray-900 tracking-tighter mt-1">
                                            {urgentNeeds.length}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 border border-border flex items-center justify-center text-red-600">
                                        <Activity size={20} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Donation History */}
                <div className="mt-8">
                    <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                        <CardHeader className="pb-8 pt-6 border-b border-border bg-gray-50/30">
                            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
                                <Clock size={12} /> Donation History
                            </div>
                            <CardTitle className="text-xl font-black tracking-tight text-gray-900">Past Donations</CardTitle>
                            <CardDescription className="text-gray-500 font-medium font-mono text-[11px]">Your blood donation history and impact</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {donationHistory.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50 border-b border-border">
                                            <tr className="border-none">
                                                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left px-8 py-4">Date</th>
                                                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left px-8 py-4">Hospital</th>
                                                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left px-8 py-4">Blood Type</th>
                                                <th className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left px-8 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donationHistory.map((donation, index) => (
                                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                    <td className="px-8 py-4 text-sm text-gray-900">{new Date(donation.created_at).toLocaleDateString()}</td>
                                                    <td className="px-8 py-4 text-sm text-gray-900 font-medium">{donation.bloodRequest?.user?.name || 'N/A'}</td>
                                                    <td className="px-8 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            {donation.blood_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            donation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                            donation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {donation.status === 'completed' ? 'Completed' :
                                                             donation.status === 'scheduled' ? 'Scheduled' :
                                                             donation.status === 'in_progress' ? 'In Progress' :
                                                             donation.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="h-16 w-16 border border-border bg-gray-50 flex items-center justify-center mx-auto mb-6">
                                        <Heart className="h-8 w-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No Donations Yet</h3>
                                    <p className="text-gray-500 text-sm font-medium max-w-md mx-auto">
                                        You haven't made any blood donations yet. Sign up for available blood requests to start saving lives!
                                    </p>
                                    <Button
                                        asChild
                                        className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-none shadow-none"
                                    >
                                        <Link href="/requests">View Available Requests</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
