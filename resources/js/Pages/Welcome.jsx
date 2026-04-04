import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Link, Head } from '@inertiajs/react';
import { Heart, Hospital, ShieldCheck, ArrowRight, Users, Activity, Clock, Menu, X, LayoutDashboard, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Welcome() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const features = [
        {
            title: 'Urgent Requests',
            description: 'Hospitals can post real-time urgent blood needs for immediate response.',
            icon: Activity,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
        {
            title: 'Donor Registry',
            description: 'A centralized database of donors sorted by blood type and location.',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            title: 'Real-time Tracking',
            description: 'Monitor the status of donations and fulfillment of hospital requests.',
            icon: Clock,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title="BloodLine – Every Drop Counts" />

            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-red-600 p-1.5 rounded-lg">
                            <Heart className="h-6 w-6 text-white fill-current" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">BloodLine</span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="h-10 px-4 font-semibold">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button className="h-10 px-5 font-bold bg-red-600 hover:bg-red-700">
                                Join BloodLine <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] sm:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl z-[60] sm:hidden pt-20 px-4"
                        >
                            <nav className="flex flex-col gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 font-bold transition-all",
                                        route().current('/') ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Heart size={20} />
                                    Home
                                </Link>
                                <div className="my-4 border-t border-gray-100" />
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 p-4 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                >
                                    <User size={20} />
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 p-4 bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
                                >
                                    Join BloodLine
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1">
                <section className="relative overflow-hidden px-6 py-20 sm:py-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-8"
                            >
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
                                    Every Drop Counts.
                                    <br />
                                    <span className="text-red-600">Save a Life Today.</span>
                                </h1>
                                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                                    BloodLine connects hospitals with life-saving donors in real-time. 
                                    Our centralized portal manages urgent requests and streamlines the donation process.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/register">
                                        <Button className="h-12 px-8 text-base font-bold bg-red-600 hover:bg-red-700">
                                            Become a Donor <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" className="h-12 px-8 text-base font-bold">
                                            Hospital Onboarding
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <Card className="p-6 shadow-lg border-none bg-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Hospital className="h-6 w-6 text-red-600" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            Hospitals
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">28</p>
                                    <p className="text-sm text-gray-500">Partner facilities on the network</p>
                                </Card>
                                <Card className="p-6 shadow-lg border-none bg-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Users className="h-6 w-6 text-blue-600" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            Donors
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">1,245</p>
                                    <p className="text-sm text-gray-500">Active registered donors</p>
                                </Card>
                                <Card className="p-6 shadow-lg border-none bg-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="h-6 w-6 text-green-600" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            Lives Saved
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">5,680</p>
                                    <p className="text-sm text-gray-500">Estimated via completed donations</p>
                                </Card>
                                <Card className="p-6 shadow-lg border-none bg-white">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Activity className="h-6 w-6 text-indigo-600" />
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            This Month
                                        </p>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">342</p>
                                    <p className="text-sm text-gray-500">Donations processed</p>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-6 bg-white">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why BloodLine</h2>
                            <p className="text-gray-600">
                                BloodLine serves three key roles in the emergency response ecosystem.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={feature.title} className="h-full flex flex-col items-start p-8">
                                    <div className={`${feature.bg} p-3 rounded-xl mb-6`}>
                                        <feature.icon className={`${feature.color} h-8 w-8`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="bg-white border-t border-gray-100 py-16 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-red-600 mb-2">
                                <Hospital className="h-6 w-6" />
                                <h4 className="text-xl font-bold">For Hospitals</h4>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li>Post urgent blood requests with specific types and units.</li>
                                <li>Track real-time responses from available donors.</li>
                                <li>Manage multiple requests across departments.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-red-600 mb-2">
                                <Heart className="h-6 w-6" />
                                <h4 className="text-xl font-bold">For Donors</h4>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li>Register your blood type and availability.</li>
                                <li>Receive notifications for urgent requests in your area.</li>
                                <li>Track your donation history and impact.</li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-red-600 mb-2">
                                <ShieldCheck className="h-6 w-6" />
                                <h4 className="text-xl font-bold">For Admins</h4>
                            </div>
                            <ul className="space-y-3 text-gray-600">
                                <li>Oversee the entire network of hospitals and donors.</li>
                                <li>Verify hospital credentials and manage roles.</li>
                                <li>Analyze system-wide statistics for better response.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6 bg-gray-900 text-white">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Ready to make a difference?
                        </h2>
                        <p className="text-gray-300 text-base sm:text-lg">
                            Join BloodLine today and become a lifesaver in your community.
                        </p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/register">
                                <Button className="h-12 px-10 font-bold bg-red-600 hover:bg-red-700">
                                    Get Started
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" className="h-12 px-10 font-bold text-white border-gray-600 hover:bg-white hover:text-gray-900">
                                    I already have an account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} BloodLine Emergency Response.</p>
                    <div className="flex gap-4">
                        <span>Privacy</span>
                        <span>Terms</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
