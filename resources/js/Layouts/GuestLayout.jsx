import React from 'react';
import { Card, CardContent } from "@/Components/ui/card";
import { Link } from '@inertiajs/react';
import { Heart } from "lucide-react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="mb-8 text-center">
                <Link href="/" className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-600 p-2 rounded-xl shadow-lg">
                            <Heart className="h-6 w-6 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">BloodLine</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Emergency Response Portal
                    </p>
                </Link>
            </div>

            <Card className="w-full sm:max-w-md border border-gray-100 bg-white shadow-xl rounded-2xl">
                <CardContent className="p-8 sm:p-10">
                    {children}
                </CardContent>
            </Card>

            <p className="mt-6 text-[11px] text-gray-400 text-center">
                © {new Date().getFullYear()} BloodLine. Secure access only.
            </p>
        </div>
    );
}
