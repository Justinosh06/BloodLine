import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

export default function Dashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none overflow-hidden">
                    <CardContent className="py-8">
                        <h3 className="text-3xl font-bold">Welcome to BloodLine</h3>
                        <p className="text-red-100 mt-2">You are successfully logged in to your dashboard.</p>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <div className="h-px bg-border mx-6" />
                    <CardContent className="gap-4 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link href={route('requests.available')}>
                                <Card className="bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                                    <CardContent className="py-6 text-center">
                                        <div className="text-3xl mb-2">🏥</div>
                                        <p className="font-semibold text-gray-900">View Requests</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href={route('profile.edit')}>
                                <Card className="bg-green-50 border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                                    <CardContent className="py-6 text-center">
                                        <div className="text-3xl mb-2">📋</div>
                                        <p className="font-semibold text-gray-900">My Profile</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href={route('inventory')}>
                                <Card className="bg-purple-50 border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                                    <CardContent className="py-6 text-center">
                                        <div className="text-3xl mb-2">🩸</div>
                                        <p className="font-semibold text-gray-900">Blood Inventory</p>
                                    </CardContent>
                                </Card>
                            </Link>
                            <Link href={route('requests.create')}>
                                <Card className="bg-yellow-50 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors">
                                    <CardContent className="py-6 text-center">
                                        <div className="text-3xl mb-2">➕</div>
                                        <p className="font-semibold text-gray-900">Create Request</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Section */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-8">
                        <TabsTrigger
                            value="overview"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="features"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-2 px-1"
                        >
                            Features
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card className="mt-6">
                            <CardContent className="py-8 text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Dashboard Overview</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Welcome to your BloodLine dashboard. Here you can manage blood requests, track donations,
                                    and monitor your hospital or donor profile.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <Card className="bg-red-50 border-red-100">
                                        <CardContent className="py-4 text-center">
                                            <p className="text-3xl font-bold text-red-600">{stats?.activeRequests || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">Active Requests</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-blue-50 border-blue-100">
                                        <CardContent className="py-4 text-center">
                                            <p className="text-3xl font-bold text-blue-600">{stats?.totalDonors || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">Total Donors</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-green-50 border-green-100">
                                        <CardContent className="py-4 text-center">
                                            <p className="text-3xl font-bold text-green-600">{stats?.livesSaved || 0}</p>
                                            <p className="text-sm text-gray-600 mt-1">Lives Saved</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="features">
                        <Card className="mt-6">
                            <CardContent className="space-y-4 py-8">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg">🔍 Real-Time Blood Inventory</h4>
                                    <p className="text-gray-600">Track blood availability across all partner hospitals in real-time.</p>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg">🚨 Instant Emergency Alerts</h4>
                                    <p className="text-gray-600">Receive immediate notifications when your blood type is critically needed.</p>
                                </div>
                                <div className="h-px bg-border" />
                                <div className="space-y-2">
                                    <h4 className="font-bold text-lg">❤️ Impact Tracking</h4>
                                    <p className="text-gray-600">See exactly how many lives your donations have saved.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
