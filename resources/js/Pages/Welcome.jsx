import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppNavbar from '@/Components/Navbar';

export default function Welcome() {
    return (
        <div className="bg-white min-h-screen">
            <Head title="Welcome - BloodLine" />
            <AppNavbar />

            {/* Hero Section */}
            <section className="relative py-32 px-6 flex flex-col items-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] -z-10" />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
                        Connecting <span className="text-red-600 animate-pulse">Blood</span> to those who need it most.
                    </h1>
                    <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        BloodLine is a third-party management system that bridges the gap between hospitals and heroic donors across the country.
                    </p>
                    <div className="mt-12 flex gap-4 justify-center flex-wrap">
                        <Button
                            asChild
                            variant="danger"
                            size="lg"
                            radius="full"
                            className="px-10 font-bold text-lg h-14"
                        >
                            <Link href="/register">Register as Donor</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            radius="full"
                            className="px-10 font-bold text-lg border-2 h-14"
                        >
                            <Link href="/register">Hospital Partner</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Why Choose BloodLine?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white border-none shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <CardContent className="py-12 text-center">
                                <div className="text-6xl mb-6">🏥</div>
                                <h3 className="text-2xl font-bold mb-3">Real-Time Inventory</h3>
                                <p className="text-gray-600">
                                    Live tracking of blood inventory across all partner hospitals and clinics.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <CardContent className="py-12 text-center">
                                <div className="text-6xl mb-6">🚨</div>
                                <h3 className="text-2xl font-bold mb-3">Instant Alerts</h3>
                                <p className="text-gray-600">
                                    Get notified immediately when your blood type is needed in emergencies.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-none shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <CardContent className="py-12 text-center">
                                <div className="text-6xl mb-6">❤️</div>
                                <h3 className="text-2xl font-bold mb-3">Save Lives</h3>
                                <p className="text-gray-600">
                                    Be a hero! Track your impact and see how many lives you've helped save.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-6xl font-black mb-2">1,245</div>
                            <p className="text-red-100 font-medium">Active Donors</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">28</div>
                            <p className="text-red-100 font-medium">Partner Hospitals</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">5,680</div>
                            <p className="text-red-100 font-medium">Lives Saved</p>
                        </div>
                        <div>
                            <div className="text-6xl font-black mb-2">342</div>
                            <p className="text-red-100 font-medium">Donations This Month</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl font-bold mb-8 tracking-tight">Ready to Make a Difference?</h2>
                    <p className="text-xl text-gray-600 mb-12">
                        Join BloodLine today and become a lifesaver in your community.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                            asChild
                            variant="danger"
                            size="lg"
                            radius="full"
                            className="px-12 font-bold h-14"
                        >
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            radius="full"
                            className="px-12 font-bold border-2 h-14"
                        >
                            <Link href="/register">Register Now</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-3xl font-bold mb-6">Blood<span className="text-red-600 animate-pulse">Line</span></p>
                    <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                        © 2024 BloodLine. All rights reserved. Saving lives, one donation at a time.
                    </p>
                </div>
            </footer>
        </div>
    );
}