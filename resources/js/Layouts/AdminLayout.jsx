import { Link, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LayoutDashboard, Database, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { url } = usePage();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/inventory', label: 'Live Inventory', icon: Database },
        { href: '/admin/users', label: 'User Management', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
                <div className="flex items-center justify-between h-16 px-4">
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
                            <span className="text-white font-black text-xl">B</span>
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">BloodLine <span className="text-indigo-600 font-black">HQ</span></h1>
                    </Link>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)] lg:h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-64 bg-white border-r border-border flex-col">
                    <div className="p-6">
                        <Link href="/" className="group flex items-center gap-2">
                            <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
                                <span className="text-white font-black text-xl">B</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">BloodLine <span className="text-indigo-600 font-black">HQ</span></h1>
                        </Link>
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-4">Infrastructure</p>
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start rounded-none py-6 font-semibold",
                                    url.startsWith(item.href)
                                        ? "bg-gray-100 text-indigo-600"
                                        : "hover:bg-gray-100 hover:text-indigo-600"
                                )}
                            >
                                <Link href={item.href} className="flex items-center gap-3">
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <div className="mt-auto p-4 border-t border-border bg-gray-50/50">
                        <Button asChild variant="outline" className="w-full justify-center rounded-none border-gray-200 text-gray-600 hover:bg-white hover:text-red-600 hover:border-red-200 transition-all">
                            <Link href="/logout" method="post" as="button" className="w-full text-center font-bold">Sign Out</Link>
                        </Button>
                    </div>
                </aside>

                {/* Mobile Navigation Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-2xl z-[60] lg:hidden pt-4 px-4"
                            >
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                    <Link href="/" className="group flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center shadow-sm">
                                            <span className="text-white font-black text-xl">B</span>
                                        </div>
                                        <h1 className="text-lg font-bold text-gray-900 tracking-tight">BloodLine <span className="text-indigo-600 font-black">HQ</span></h1>
                                    </Link>
                                </div>

                                <nav className="flex flex-col gap-2">
                                    <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Infrastructure</p>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 font-bold transition-all",
                                                url.startsWith(item.href)
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            <item.icon size={20} />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>

                                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-gray-50/50">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 transition-all font-bold"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </Link>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main className="flex-1 p-4 lg:p-12 overflow-auto">{children}</main>
            </div>
        </div>
    );
}