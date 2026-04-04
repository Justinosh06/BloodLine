import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Head, useForm, Link } from '@inertiajs/react';
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";

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
            <Head title="Sign in to BloodLine" />

            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
                            <Heart className="h-8 w-8 text-white fill-current" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="text-sm text-gray-600">
                        Sign in to access your BloodLine dashboard.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={data.remember}
                                onCheckedChange={(val) => setData('remember', val)}
                            />
                            <span className="text-xs text-gray-600">Remember me</span>
                        </div>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 text-sm font-bold bg-red-600 hover:bg-red-700"
                        disabled={processing}
                    >
                        {processing ? "Signing in..." : "Sign In"}
                        {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-500">
                    New to BloodLine?{" "}
                    <Link href="/register" className="font-semibold text-red-600 hover:text-red-700">
                        Create an account
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}

