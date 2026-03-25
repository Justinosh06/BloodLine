import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Toaster } from 'sonner';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-[#f9fafb] selection:bg-indigo-100 selection:text-indigo-900">
            <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="group flex items-center gap-2">
                                <div className="h-8 w-8 bg-gray-900 flex items-center justify-center rounded-none group-hover:bg-indigo-600 transition-colors">
                                    <span className="text-white font-black text-xl">B</span>
                                </div>
                                <p className="font-bold text-gray-900 text-xl tracking-tight">
                                    Blood<span className="text-indigo-600 font-black">Line</span>
                                </p>
                            </Link>

                            <div className="hidden sm:flex space-x-1">
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={route('requests.available')}
                                        className="text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                                    >
                                        Available Requests
                                    </Link>
                                    <Link
                                        href={user.role === 'hospital' ? route('inventory') : route('dashboard')}
                                        className="text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                                    >
                                        {user.role === 'hospital' ? 'Inventory' : 'Donation Status'}
                                    </Link>
                                    {user.role === 'hospital' && (
                                        <Link
                                            href={route('requests.create')}
                                            className="text-sm font-semibold text-gray-600 hover:text-indigo-600 px-4 py-2 transition-colors"
                                        >
                                            Create Request
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10 w-10 p-0 rounded-none border-border hover:bg-gray-50 overflow-hidden">
                                        <Avatar className="h-10 w-10 rounded-none">
                                            <AvatarImage src={`https://avatar.vercel.sh/${user.name}.png`} alt={user.name} className="rounded-none" />
                                            <AvatarFallback className="bg-gray-100 text-gray-900 font-black rounded-none">
                                                {user.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-none border-border shadow-2xl">
                                    <div className="px-3 py-2 border-b border-border bg-gray-50/50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Portal</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                    </div>
                                    <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                        <Link href={user.role === 'hospital' ? route('inventory') : route('dashboard')} className="font-semibold w-full">
                                            {user.role === 'hospital' ? 'Blood Inventory' : 'Donation Status'}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                        <Link href={route('requests.available')} className="font-semibold w-full">
                                            Available Requests
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === 'hospital' && (
                                        <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                            <Link href={route('requests.create')} className="font-semibold w-full">
                                                Create Request
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {user.role === 'hospital' && (
                                        <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                            <Link href={route('inventory')} className="font-semibold w-full">
                                                Blood Inventory
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    {user.role === 'hospital' && (
                                        <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                            <Link href={route('calendar')} className="font-semibold w-full">
                                                Calendar
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild className="rounded-none focus:bg-gray-50 focus:text-indigo-600 cursor-pointer py-2.5">
                                        <Link href={route('profile.edit')} className="font-semibold w-full">
                                            Profile Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-none text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5 border-t border-border">
                                        <Link href={route('logout')} method="post" as="button" className="w-full text-left font-semibold">
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-border">
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {children}
            </main>
            
            <Toaster 
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
            />
        </div>
    );
}
