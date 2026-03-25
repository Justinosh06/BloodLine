import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { AlertCircle, Trash2, ShieldAlert } from "lucide-react";

export default function DeleteUserForm({ className = '' }) {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">
                    <AlertCircle size={10} /> Terminal Protocol
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Delete Account</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
                    Deleting your account will permanently remove all your data and cannot be undone.
                </p>
            </header>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-none border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest h-11 px-8 shadow-none">
                        Delete Account
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-none border-border shadow-2xl max-w-md bg-white p-0 overflow-hidden">
                    <div className="h-1 w-full bg-red-600" />
                    <div className="p-8">
                        <DialogHeader className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                                    <ShieldAlert size={16} />
                                </div>
                                <DialogTitle className="text-lg font-black text-gray-900 uppercase tracking-tight">CONFIRM_PURGE_SEQUENCE</DialogTitle>
                            </div>
                            <DialogDescription className="text-[11px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                                CRITICAL: All node resources, biological telemetry, and encrypted keys will be permanently purged. Authentication required to proceed.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={deleteUser} className="space-y-6">
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="rounded-none border-border shadow-none h-11"
                                placeholder="ENTER_SECURE_PHRASE"
                                label="SECURITY_CHALLENGE"
                                isInvalid={!!errors.password}
                                errorMessage={errors.password}
                            />

                            <DialogFooter className="flex flex-row gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 rounded-none border-border font-black text-[10px] uppercase tracking-widest h-11 shadow-none"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-none bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest h-11 shadow-none flex items-center justify-center gap-2"
                                >
                                    {processing ? "Deleting..." : "Delete Account"} <Trash2 size={12} />
                                </Button>
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

