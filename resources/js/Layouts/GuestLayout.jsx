import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f9fafb]">
            <div className="mb-10 text-center">
                <Link href="/" className="flex flex-col items-center gap-1 group">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-black text-xl">B</span>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">BloodLine</h1>
                    </div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-10">
                        Biological Grid
                    </div>
                </Link>
            </div>

            <Card className="w-full sm:max-w-md border-border bg-white shadow-none rounded-none overflow-hidden">
                <div className="h-1 w-full bg-indigo-600" />
                <CardContent className="p-10">
                    {children}
                </CardContent>
            </Card>

            <div className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Infrastructure v4.0.2 // Secure Entry Node
            </div>
        </div>
    );
}