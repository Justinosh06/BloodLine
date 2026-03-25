import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Head, useForm, Link } from '@inertiajs/react';
import { Shield, ArrowRight, Activity } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Node Authentication" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <Shield size={10} /> Identity Verification
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Access Portal</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Authorized personnel only // System: BL_GRID</p>
                </div>

                <div className="space-y-4">
                    <Input
                        label="PROTOCOL_EMAIL"
                        type="email"
                        placeholder="identity@grid.local"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email}
                        className="rounded-none border-border"
                    />

                    <Input
                        label="SECURE_PHRASE"
                        type="password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password}
                        className="rounded-none border-border"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Checkbox
                        checked={data.remember}
                        onCheckedChange={(val) => setData('remember', val)}
                        className="rounded-none"
                    >
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Keep Sync</span>
                    </Checkbox>
                    <Link
                        href={route('password.request')}
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                    >
                        Recovery System
                    </Link>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-black text-[10px] uppercase tracking-widest h-12 shadow-none flex items-center justify-center gap-2"
                    isLoading={processing}
                    disabled={processing}
                >
                    {processing ? "AUTHENTICATING..." : "INITIATE ACCESS"} <ArrowRight size={14} />
                </Button>

                <div className="pt-6 border-t border-border mt-2">
                    <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        New Node Identity? <Link href="/register" className="text-indigo-600 hover:underline">Register Sequential</Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}

