import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Shield, Lock, CheckCircle2 } from "lucide-react";

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
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
                    <Shield size={10} /> Security Protocol
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Credential Rotation</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    Ensure account entropy by implementing high-complexity passphrases.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <Input
                    label="CURRENT_PHRASE"
                    id="current_password"
                    ref={currentPasswordInput}
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    type="password"
                    className="rounded-none border-border shadow-none"
                    autoComplete="current-password"
                    errorMessage={errors.current_password}
                    isInvalid={!!errors.current_password}
                />

                <Input
                    label="NEW_PHRASE_INPUT"
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    type="password"
                    className="rounded-none border-border shadow-none"
                    autoComplete="new-password"
                    errorMessage={errors.password}
                    isInvalid={!!errors.password}
                />

                <Input
                    label="VALIDATE_NEW_PHRASE"
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    type="password"
                    className="rounded-none border-border shadow-none"
                    autoComplete="new-password"
                    errorMessage={errors.password_confirmation}
                    isInvalid={!!errors.password_confirmation}
                />

                <div className="flex items-center gap-6 pt-4">
                    <Button
                        disabled={processing}
                        className="rounded-none bg-orange-600 hover:bg-orange-700 text-white font-black text-[10px] uppercase tracking-widest px-8 shadow-none h-11"
                    >
                        Update Password
                    </Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} /> ROTATION_SUCCESS
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

