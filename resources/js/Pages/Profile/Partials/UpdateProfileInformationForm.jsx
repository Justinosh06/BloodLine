import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Activity, CheckCircle2 } from "lucide-react";

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
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
                    <Activity size={10} /> Data Integrity
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Identity Records</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    Modify node identification and communication channels.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <Input
                    label="RECORD_NAME"
                    id="name"
                    className="rounded-none border-border shadow-none"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    isFocused
                    autoComplete="name"
                    errorMessage={errors.name}
                    isInvalid={!!errors.name}
                />

                <Input
                    label="RECORD_EMAIL"
                    id="email"
                    type="email"
                    className="rounded-none border-border shadow-none"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    autoComplete="username"
                    errorMessage={errors.email}
                    isInvalid={!!errors.email}
                />

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 border border-orange-200 bg-orange-50">
                        <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest leading-relaxed">
                            UNVERIFIED_CHANNEL: Verification required for full grid integration.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="block mt-2 underline hover:text-orange-900"
                            >
                                Re-transmit verification protocol.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-[10px] font-black text-green-700 uppercase tracking-widest">
                                PROTOCOL_SENT: New verification link transmitted.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <Button
                        disabled={processing}
                        className="rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-none h-11"
                    >
                        Save Changes
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Sync_Successful
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

