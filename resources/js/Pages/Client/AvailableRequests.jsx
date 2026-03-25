import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Search, MapPin, Clock, Hash, Heart, Zap, ChevronRight, Users, Calendar, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { toast } from 'sonner';

export default function AvailableRequests({ auth, requests }) {
    const [filterBloodType, setFilterBloodType] = useState("all");
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [selectedDonations, setSelectedDonations] = useState([]);

    const { data, setData, post, processing } = useForm({
        blood_request_id: '',
        donation_session: '',
    });

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+"];

    const filtered = filterBloodType === "all"
        ? requests
        : requests.filter(req => req.blood_type === filterBloodType);

    const openRegistrationModal = (request) => {
        setSelectedRequest(request);
        setData('blood_request_id', request.id);
        setShowRegistrationModal(true);
    };

    const handleRegisterDonation = (e) => {
        e.preventDefault();
        
        post(route('donations.register'), {
            onSuccess: (page) => {
                toast.success(`Successfully registered for donation to ${selectedRequest.hospital}!`);
                setShowRegistrationModal(false);
                setData({
                    blood_request_id: '',
                    donation_session: '',
                });
                console.log('Requests updated:', page.props.requests);
            },
            onError: (errors) => {
                toast.error(errors.blood_request_id || errors.donation_session || 'Error registering for donation. Please try again.');
                console.error('Registration errors:', errors);
            }
        });
    };

    const handleViewDonorProfile = (request) => {
        const donor = request.donor;
        if (!donor) {
            toast.info('No donor has registered for this request yet.');
            return;
        }

        const profile = `
DONOR PROFILE
============
Name: ${donor.name}
Blood Type: ${donor.blood_type}
Last Donation: ${donor.last_donation}
Phone: ${donor.phone}

Request Details:
Hospital: ${request.hospital}
Units Needed: ${request.units}
Urgency: ${request.urgency}
Posted: ${request.posted}

This donor is available and eligible for donation.
        `.trim();
        
        alert(profile);
    };

    const handleAcceptDonation = (request) => {
        if (!request.donor) {
            toast.info('No donor registered for this request yet.');
            return;
        }

        if (confirm(`Accept donation from ${request.donor.name} for 1 unit of ${request.blood_type} blood?`)) {
            post(route('donations.accept'), {
                blood_request_id: request.id,
                donor_id: request.donor.id,
                action: 'accept'
            }, {
                onSuccess: (page) => {
                    toast.success(`Donation from ${request.donor.name} has been accepted!`);
                    console.log('Requests updated:', page.props.requests);
                },
                onError: (errors) => {
                    toast.error('Error accepting donation. Please try again.');
                    console.error('Accept errors:', errors);
                }
            });
        }
    };

    const handleRejectDonation = (request) => {
        if (!request.donor) {
            toast.info('No donor registered for this request yet.');
            return;
        }

        if (confirm(`Reject donation from ${request.donor.name}?`)) {
            post(route('donations.accept'), {
                blood_request_id: request.id,
                donor_id: request.donor.id,
                action: 'reject'
            }, {
                onSuccess: (page) => {
                    toast.error(`Donation from ${request.donor.name} has been rejected.`);
                    console.log('Requests updated:', page.props.requests);
                },
                onError: (errors) => {
                    toast.error('Error rejecting donation. Please try again.');
                    console.error('Reject errors:', errors);
                }
            });
        }
    };

    const openDonorModal = (request) => {
        setSelectedRequest(request);
        setSelectedDonations(request.donations || []);
        setShowDonorModal(true);
    };

    const handleUpdateDonationStatus = (donation, status) => {
        console.log('Updating donation status:', { donationId: donation.id, donorId: donation.donor_id, status });
        
        // Immediate UI feedback
        toast.success(`Updating status to: ${status}...`);
        
        // Update local state immediately for responsive UI
        setSelectedDonations(prev => 
            prev.map(d => d.id === donation.id ? {...d, status} : d)
        );
        
        post(route('donations.update-status'), {
            blood_request_id: selectedRequest.id,
            donor_id: donation.donor_id,
            status: status
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log('Status update SUCCESS:', page);
                toast.success(`Donation status updated to: ${status}`);
                setShowDonorModal(false);
                // Force immediate hard reload
                window.location.reload();
            },
            onError: (errors) => {
                console.error('Status update FAILED:', errors);
                toast.error('Error: ' + (errors.message || Object.values(errors).join(', ')));
            },
            onFinish: () => {
                console.log('Request finished - reloading page');
                window.location.reload();
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        {auth.user.role === 'donor' ? (
                            <>Blood Requests <ChevronRight size={10} /> Available</>
                        ) : (
                            <>Blood Requests <ChevronRight size={10} /> Your Requests</>
                        )}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                        {auth.user.role === 'donor' ? 'Available Blood Requests' : 'Your Blood Requests'}
                    </h2>
                </div>
            }
        >
            <Head title="Available Blood Requests" />

            <div className="space-y-8">
                {/* Donor Blood Type Notice */}
                {auth.user.role === 'donor' && (
                    <Card className="border-blue-200 bg-blue-50 shadow-none rounded-none">
                        <CardContent className="py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 border-2 border-blue-300 bg-white rounded flex items-center justify-center">
                                    <span className="text-lg font-black text-blue-600">{auth.user.blood_type}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Your Blood Type: {auth.user.blood_type}</p>
                                    <p className="text-xs text-blue-700">You can only register for donations that match your blood type.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Filter Section */}
                <Card className="border-border bg-white shadow-none rounded-none">
                    <CardContent className="py-6 flex flex-wrap gap-6 items-end">
                        <div className="flex-1 min-w-[280px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
                                {auth.user.role === 'donor' ? 'Search Hospitals' : 'Search Your Requests'}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder={auth.user.role === 'donor' ? 'Search hospital names...' : 'Search your requests...'}
                                    className="pl-9 h-10 bg-gray-50/30 border-border rounded-none text-sm font-medium"
                                />
                            </div>
                        </div>
                        <div className="w-[200px]">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">Blood Type</label>
                            <Select
                                value={filterBloodType}
                                onValueChange={setFilterBloodType}
                            >
                                <SelectTrigger className="h-10 bg-gray-50/30 border-border rounded-none text-sm font-bold">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-border">
                                    <SelectItem value="all" className="rounded-none">All Types</SelectItem>
                                    {bloodTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="rounded-none">
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            className="h-10 px-6 font-bold text-[10px] uppercase tracking-widest rounded-none border-border hover:bg-gray-50 text-gray-500"
                            onClick={() => setFilterBloodType("all")}
                        >
                            Reset Filter
                        </Button>
                    </CardContent>
                </Card>

                {/* Requests List */}
                <div className="space-y-4">
                    {filtered.length > 0 ? (
                        filtered.map((req) => (
                            <Card key={req.id} className="border-border bg-white shadow-none rounded-none overflow-hidden group hover:border-indigo-200 transition-colors">
                                <div className={`h-1 w-full ${req.urgency === 'Critical' ? 'bg-red-600' : req.urgency === 'High' ? 'bg-orange-500' : 'bg-indigo-500'}`} />
                                <CardContent className="py-6 px-8">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-black text-gray-900 tracking-tight">{req.hospital}</h3>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "rounded-none px-3 py-1 font-black text-[9px] uppercase tracking-widest",
                                                        req.urgency === 'Critical' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            req.urgency === 'High' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                    )}
                                                >
                                                    {req.urgency}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-[10px] mt-2 font-black uppercase tracking-widest">
                                                <Clock className="h-3 w-3" />
                                                Posted {req.posted} <span className="mx-2 text-gray-100">|</span> <Hash size={10} /> ID-{req.id * 1024}
                                            </div>

                                            <div className="flex gap-4 mt-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Type</span>
                                                    <div className="h-10 w-16 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-black text-xl">
                                                        {req.blood_type}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Units Needed</span>
                                                    <div className="h-10 px-4 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-bold text-sm">
                                                        {req.units} UNITS
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-48">
                                            {auth.user.role === 'donor' ? (
                                                // Donor View - Check if current user is registered
                                                req.donations && req.donations.some(d => d.donor_id === auth.user.id) ? (
                                                    <div className="text-center text-gray-500 text-sm font-medium">
                                                        <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-2">
                                                            <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-1">Already Registered</p>
                                                            <p className="text-sm">You have registered for this donation</p>
                                                            <div className="mt-2">
                                                                <Badge className={
                                                                    req.donations.find(d => d.donor_id === auth.user.id)?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    req.donations.find(d => d.donor_id === auth.user.id)?.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                                    req.donations.find(d => d.donor_id === auth.user.id)?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }>
                                                                    {req.donations.find(d => d.donor_id === auth.user.id)?.status || 'Registered'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            className="border-border rounded-none font-bold text-[10px] uppercase tracking-widest h-10 text-gray-500"
                                                            disabled
                                                        >
                                                            Registered
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-none shadow-none active:scale-[0.98] transition-all"
                                                        onClick={() => openRegistrationModal(req)}
                                                        disabled={processing}
                                                    >
                                                        <Zap className="mr-2 h-3 w-3" /> Sign Up to Donate
                                                    </Button>
                                                )
                                            ) : (
                                                // Hospital View - Manage donor registrations
                                                req.donations && req.donations.length > 0 ? (
                                                    <>
                                                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                                                            <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">
                                                                <Users className="inline h-3 w-3 mr-1" />
                                                                {req.donations.length} Donor{req.donations.length !== 1 ? 's' : ''} Registered
                                                            </p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {req.donations.map((donation, idx) => (
                                                                    <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                        {donation.donor.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            className="border-border rounded-none font-bold text-[10px] uppercase tracking-widest h-10 text-gray-500 hover:bg-gray-50 hover:text-gray-900 mb-2 w-full"
                                                            onClick={() => openDonorModal(req)}
                                                        >
                                                            <Users className="mr-2 h-3 w-3" />
                                                            Manage Donors ({req.donations.length})
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-2">
                                                            <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-1">No Donor Registrations</p>
                                                            <p className="text-sm">No donors have registered for this request yet.</p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            className="border-border rounded-none font-bold text-[10px] uppercase tracking-widest h-10 text-gray-500"
                                                            disabled
                                                        >
                                                            Waiting for Donors
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="border-border bg-white shadow-none rounded-none py-20 text-center">
                            <CardContent className="flex flex-col items-center">
                                <div className="h-12 w-12 border border-border bg-gray-50 flex items-center justify-center mb-6">
                                    <Search className="h-6 w-6 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                    {auth.user.role === 'donor' ? 'No Available Requests' : 'No Requests Found'}
                                </h3>
                                <p className="text-gray-500 mt-2 text-sm font-medium">
                                    {auth.user.role === 'donor' 
                                        ? `No blood requests are currently available for your blood type (${auth.user.blood_type}).`
                                        : 'No blood requests match your current filter criteria.'
                                    }
                                </p>
                                <Button
                                    variant="link"
                                    className="mt-4 text-indigo-600 font-black uppercase tracking-widest text-[10px]"
                                    onClick={() => setFilterBloodType("all")}
                                >
                                    Reset Blood Type Filter
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
                <DialogContent className="max-w-md border-border bg-white rounded-none p-8">
                    <form onSubmit={handleRegisterDonation}>
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Sign Up for Blood Donation
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium">
                                Sign up to donate 1 unit of blood to {selectedRequest?.hospital}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hospital</label>
                                <div className="h-10 px-4 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-bold text-sm">
                                    {selectedRequest?.hospital}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Type</label>
                                <div className="h-10 px-4 border border-border bg-gray-50 flex items-center justify-center text-gray-900 font-bold text-sm">
                                    {selectedRequest?.blood_type}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Donation Session</label>
                                <Select 
                                    value={data.donation_session} 
                                    onValueChange={(val) => setData('donation_session', val)}
                                >
                                    <SelectTrigger className="h-10 border-border bg-gray-50/50 rounded-none">
                                        <SelectValue placeholder="Select session..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-border">
                                        <SelectItem value="morning" className="rounded-none">Morning (9:00 AM - 12:00 PM)</SelectItem>
                                        <SelectItem value="afternoon" className="rounded-none">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                                        <SelectItem value="evening" className="rounded-none">Evening (6:00 PM - 9:00 PM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-4">
                                <p className="text-sm font-medium text-blue-900">
                                    <strong>Note:</strong> You will be donating 1 unit of blood. 
                                    Each donor can only have one active donation at a time.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="mt-8 flex gap-3">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                className="h-10 px-6 font-bold text-gray-500 rounded-none" 
                                onClick={() => setShowRegistrationModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={processing}
                                className="h-10 px-8 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-indigo-700 flex-1 shadow-none"
                            >
                                {processing ? "Registering..." : "Register"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Donor Management Modal */}
            <Dialog open={showDonorModal} onOpenChange={setShowDonorModal}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Manage Donor Registrations
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium">
                            Review and manage all donor registrations for this blood request
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Request Summary */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-3">Request Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hospital</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedRequest?.hospital}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Type</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedRequest?.blood_type}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Units Needed</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedRequest?.units}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fulfilled</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedRequest?.units_fulfilled || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Donors List */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Registered Donors ({selectedDonations.length})</h3>
                            
                            {selectedDonations.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">No donors have registered for this request yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDonations.map((donation) => (
                                        <div key={donation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${donation.donor.name}.png`} />
                                                        <AvatarFallback className="bg-gray-100 text-gray-900 font-black">
                                                            {donation.donor.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{donation.donor.name}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {donation.donor.phone}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(donation.donation_date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={`${
                                                        donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        donation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        donation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {donation.status === 'completed' ? 'Completed' :
                                                         donation.status === 'in_progress' ? 'In Progress' :
                                                         donation.status === 'scheduled' ? 'Scheduled' :
                                                         donation.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Status Update Buttons */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Update Donation Status</p>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-none"
                                                        onClick={() => handleUpdateDonationStatus(donation, 'scheduled')}
                                                        disabled={processing}
                                                    >
                                                        Scheduled
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 rounded-none"
                                                        onClick={() => handleUpdateDonationStatus(donation, 'in_progress')}
                                                        disabled={processing}
                                                    >
                                                        In Progress
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-200 text-green-600 hover:bg-green-50 rounded-none"
                                                        onClick={() => handleUpdateDonationStatus(donation, 'completed')}
                                                        disabled={processing}
                                                    >
                                                        Completed
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
