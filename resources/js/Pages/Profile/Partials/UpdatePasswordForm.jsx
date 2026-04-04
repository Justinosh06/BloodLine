import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="pl-11 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                autoComplete="current-password"
                                isInvalid={!!errors.current_password}
                            />
                        </div>
                        {errors.current_password && <p className="text-xs text-red-600 font-medium ml-1">{errors.current_password}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    type="password"
                                    className="pl-11 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                    autoComplete="new-password"
                                    isInvalid={!!errors.password}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-600 font-medium ml-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    type="password"
                                    className="pl-11 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                    autoComplete="new-password"
                                    isInvalid={!!errors.password_confirmation}
                                />
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-600 font-medium ml-1">{errors.password_confirmation}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <Button
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full px-10 h-12 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                    >
                        {processing ? 'Updating...' : 'Update Password'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                            <CheckCircle2 size={18} /> Password updated successfully.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
