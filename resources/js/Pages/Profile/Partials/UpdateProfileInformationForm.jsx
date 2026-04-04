import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { CheckCircle2, Mail, User } from "lucide-react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="name"
                                className="pl-11 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                isInvalid={!!errors.name}
                            />
                        </div>
                        {errors.name && <p className="text-xs text-red-600 font-medium ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-11 h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                isInvalid={!!errors.email}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-600 font-medium ml-1">{errors.email}</p>}
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-6 rounded-2xl border border-orange-100 bg-orange-50/50">
                        <p className="text-sm font-bold text-orange-800 leading-relaxed">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="block mt-2 underline text-orange-600 hover:text-orange-900 transition-colors"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-3 text-sm font-bold text-green-600 flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <Button
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-10 h-12 shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                            <CheckCircle2 size={18} /> Profile updated successfully.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
