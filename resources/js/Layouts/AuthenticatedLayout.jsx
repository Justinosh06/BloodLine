import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import NavLink from '@/Components/NavLink';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Toaster, toast } from 'sonner';
import { 
    LayoutDashboard, Droplets, History as HistoryIcon, 
    PlusCircle, User, LogOut, Settings, Bell, 
    Calendar, Menu, X, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Close mobile menu when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div className="min-h-screen bg-[#F5F5F7] selection:bg-red-100 selection:text-red-900 font-sans antialiased overflow-x-hidden">
            <Toaster position="top-right" richColors closeButton />
            
            <nav className="sticky top-0 z-[60] w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4 md:gap-10">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={toggleMobileMenu}
                                className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            <Link href="/" className="group flex items-center gap-2.5">
                                <div className="h-8 w-8 md:h-9 md:w-9 bg-red-600 flex items-center justify-center rounded-xl shadow-lg shadow-red-200 group-hover:scale-105 transition-transform duration-300">
                                    <Droplets className="text-white fill-white" size={18} />
                                </div>
                                <p className="font-bold text-gray-900 text-lg md:text-xl tracking-tight">
                                    Blood<span className="text-red-600 font-extrabold">Line</span>
                                </p>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center space-x-1">
                                <NavLink variant="pill" href={route('dashboard')} active={route().current('dashboard')}>
                                    <LayoutDashboard size={18} className="mr-2 opacity-70" />
                                    Dashboard
                                </NavLink>
                                
                                <NavLink variant="pill" href={route('requests.available')} active={route().current('requests.available')}>
                                    <Droplets size={18} className="mr-2 opacity-70" />
                                    {user.role === 'donor' ? 'Find Requests' : 'All Requests'}
                                </NavLink>

                                {user.role === 'hospital' && (
                                    <>
                                        <NavLink variant="pill" href={route('inventory')} active={route().current('inventory')}>
                                            <HistoryIcon size={18} className="mr-2 opacity-70" />
                                            Inventory
                                        </NavLink>
                                        <NavLink variant="pill" href={route('calendar')} active={route().current('calendar')}>
                                            <Calendar size={18} className="mr-2 opacity-70" />
                                            Calendar
                                        </NavLink>
                                        <Link
                                            href={route('requests.create')}
                                            className="ml-4 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-md shadow-gray-200 flex items-center gap-2"
                                        >
                                            <PlusCircle size={16} />
                                            Request Blood
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 md:gap-3 p-1 pl-1 md:pl-3 rounded-full border border-gray-200 bg-white hover:border-gray-300 transition-all shadow-sm">
                                        <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user.name}</span>
                                        <Avatar className="h-8 w-8 rounded-full border border-gray-100">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.name}.png`} alt={user.name} />
                                            <AvatarFallback className="bg-red-50 text-red-600 font-bold">
                                                {user.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-gray-200 shadow-xl mt-2 animate-in fade-in zoom-in-95 duration-200 z-[70]">
                                    <div className="px-3 py-3 mb-1">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Account</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator className="bg-gray-100" />
                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-gray-50 focus:text-red-600 cursor-pointer py-2.5 transition-colors">
                                        <Link href={route('profile.edit')} className="flex items-center w-full font-medium">
                                            <User size={18} className="mr-3 opacity-70" />
                                            Profile Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === 'admin' && (
                                        <DropdownMenuItem asChild className="rounded-xl focus:bg-gray-50 focus:text-red-600 cursor-pointer py-2.5 transition-colors">
                                            <Link href={route('admin.dashboard')} className="flex items-center w-full font-medium">
                                                <Settings size={18} className="mr-3 opacity-70" />
                                                Admin Console
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="bg-gray-100" />
                                    <DropdownMenuItem asChild className="rounded-xl focus:bg-red-50 focus:text-red-600 text-red-600 cursor-pointer py-2.5 transition-colors">
                                        <Link href={route('logout')} method="post" as="button" onClick={handleLogout} className="flex items-center w-full font-bold text-left">
                                            <LogOut size={18} className="mr-3 opacity-70" />
                                            Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[65] md:hidden pt-20 px-4"
                        >
                            <div className="flex flex-col gap-2">
                                <Link 
                                    href={route('dashboard')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                                        route().current('dashboard') ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboard size={20} />
                                        Dashboard
                                    </div>
                                    <ChevronRight size={16} className="opacity-30" />
                                </Link>

                                <Link 
                                    href={route('requests.available')}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                                        route().current('requests.available') ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Droplets size={20} />
                                        {user.role === 'donor' ? 'Find Requests' : 'All Requests'}
                                    </div>
                                    <ChevronRight size={16} className="opacity-30" />
                                </Link>

                                {user.role === 'hospital' && (
                                    <>
                                        <Link 
                                            href={route('inventory')}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                                                route().current('inventory') ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <HistoryIcon size={20} />
                                                Inventory
                                            </div>
                                            <ChevronRight size={16} className="opacity-30" />
                                        </Link>
                                        <Link 
                                            href={route('calendar')}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl font-bold transition-all",
                                                route().current('calendar') ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} />
                                                Calendar
                                            </div>
                                            <ChevronRight size={16} className="opacity-30" />
                                        </Link>
                                        <div className="pt-4 mt-4 border-t border-gray-100">
                                            <Link
                                                href={route('requests.create')}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full flex items-center justify-center gap-2 p-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg shadow-gray-200"
                                            >
                                                <PlusCircle size={20} />
                                                Request Blood
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {header && (
                <header className="bg-white/50 border-b border-gray-200/50 pt-8 md:pt-12 pb-6 md:pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="max-w-7xl mx-auto py-6 md:py-10 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200/50 mt-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Droplets className="text-red-600" size={20} />
                        <p className="text-sm font-semibold text-gray-500">© 2024 BloodLine Emergency Response. All rights reserved.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</a>
                        <a href="#" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
