import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Activity, ChevronRight, Layout, Power, User as UserIcon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';

export default function AppNavbar({ user }) {
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

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4 sm:gap-8">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMobileMenu}
                                className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            <Link href="/" className="group flex items-center gap-2">
                                <div className="h-8 w-8 bg-gray-900 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                    <span className="text-white font-black text-xl">B</span>
                                </div>
                                <div className="hidden sm:flex flex-col leading-none">
                                    <p className="font-black text-gray-900 text-lg tracking-tight uppercase">
                                        BloodLine
                                    </p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Biology_Grid</p>
                                </div>
                                <span className="sm:hidden font-black text-gray-900 text-lg tracking-tight uppercase">BloodLine</span>
                            </Link>

                            <div className="hidden sm:flex items-center gap-1">
                                <Link href="/" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 px-4 py-2 uppercase tracking-widest transition-colors">
                                    Home
                                </Link>
                                <Link href="/requests" className="text-[10px] font-black text-gray-400 hover:text-indigo-600 px-4 py-2 uppercase tracking-widest transition-colors">
                                    Public_Stream
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center">
                            {!user ? (
                                <div className="flex items-center space-x-4 sm:space-x-6">
                                    <Link href="/login" className="text-[10px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors">
                                        Auth_Link
                                    </Link>
                                    <Button asChild variant="outline" className="hidden sm:inline-flex border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:text-white font-black text-[10px] uppercase tracking-widest px-6 h-9">
                                        <Link href="/register">Integrate_Node</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex flex-col items-end mr-2 text-right">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{user.name}</p>
                                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.2em]">{user.role}_PROTOCOL</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-10 w-10 p-0 border-border hover:bg-gray-50 overflow-hidden shadow-none">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={`https://avatar.vercel.sh/${user.name}.png`} alt={user.name} />
                                                    <AvatarFallback className="bg-gray-100 text-gray-900 font-black">
                                                        {user.name?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-64 border-border shadow-2xl p-0 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-border bg-gray-50/50">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Authenticated Node</p>
                                                <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{user.name}</p>
                                            </div>
                                            <div className="p-1">
                                                <DropdownMenuItem asChild className="focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-3 px-3">
                                                    <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest w-full">
                                                        <Layout size={14} /> Control_Panel
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-3 px-3">
                                                    <Link href={route('profile.edit')} className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest w-full">
                                                        <UserIcon size={14} /> Identity_Config
                                                    </Link>
                                                </DropdownMenuItem>
                                            </div>
                                            <DropdownMenuItem asChild className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer py-3 px-3 border-t border-border mt-1">
                                                <Link href="/logout" method="post" as="button" className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest w-full text-left">
                                                    <Power size={14} /> Shutdown_Session
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
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
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] sm:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[60] sm:hidden pt-20 px-4"
                        >
                            <nav className="flex flex-col gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 font-bold transition-all",
                                        route().current('/') ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Activity size={20} />
                                    Home
                                </Link>
                                <Link
                                    href="/requests"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 font-bold transition-all",
                                        route().current('requests.*') ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <Layout size={20} />
                                    Public_Stream
                                </Link>
                                {!user && (
                                    <>
                                        <div className="my-4 border-t border-gray-100" />
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-4 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                                        >
                                            <Power size={20} />
                                            Auth_Link
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 p-4 bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all"
                                        >
                                            Integrate_Node
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
