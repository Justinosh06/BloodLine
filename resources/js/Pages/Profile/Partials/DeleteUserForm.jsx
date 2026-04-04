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
import { AlertTriangle, Trash2, ShieldAlert, X } from "lucide-react";

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
        <section className={className}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button 
                        variant="destructive" 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-full px-10 h-12 shadow-lg shadow-red-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <Trash2 size={18} /> Delete Account
                    </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-md bg-white p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                            <button 
                                onClick={() => setOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <DialogHeader className="mb-8 text-left">
                            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">
                                This action cannot be undone. All of your data, including donation history and medical records, will be permanently removed from our servers.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={deleteUser} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Confirm with Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="h-12 bg-gray-50/50 border-none focus:bg-white rounded-2xl shadow-none text-sm font-bold transition-all"
                                    placeholder="Enter your password to confirm"
                                    isInvalid={!!errors.password}
                                />
                                {errors.password && <p className="text-xs text-red-600 font-medium ml-1">{errors.password}</p>}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                    className="flex-1 h-12 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-100 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? "Deleting..." : "Permanently Delete"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
