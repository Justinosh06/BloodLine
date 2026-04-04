import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Activity, AlertCircle, ChevronRight, Zap, Droplets, Info, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function RequestBlood() {
    const { data, setData, post, processing, errors, reset } = useForm({
        blood_type: '',
        units_required: 1,
        urgency_level: 'medium',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('requests.store'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || "Failed to broadcast request.");
            }
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest mb-2 bg-red-50 w-fit px-3 py-1 rounded-full">
                        <Zap size={14} /> Emergency Protocol
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Broadcast Request</h2>
                    <p className="text-gray-500 mt-2 font-medium">Alert the regional network of donors about an urgent clinical need.</p>
                </div>
            }
        >
            <Head title="Request Blood" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-3xl mx-auto py-10"
            >
                <motion.div variants={item}>
                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden">
                        <div className="bg-red-600 p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Droplets size={160} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight relative z-10">Request Payload</h3>
                            <p className="text-red-100 mt-2 font-medium relative z-10">
                                Please provide accurate clinical details for the emergency broadcast.
                            </p>
                        </div>
                        
                        <form onSubmit={submit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-700 ml-1">Blood Type Required</Label>
                                    <Select
                                        value={data.blood_type}
                                        onValueChange={val => setData('blood_type', val)}
                                    >
                                        <SelectTrigger className={cn(
                                            "h-14 bg-gray-50/50 border-none rounded-2xl font-bold focus:ring-red-500 transition-all",
                                            errors.blood_type ? 'ring-2 ring-red-500' : ''
                                        )}>
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(t => (
                                                <SelectItem key={t} value={t} className="font-bold rounded-xl focus:bg-red-50 focus:text-red-600">{t} Group</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.blood_type && <p className="text-red-600 text-xs font-bold ml-1">{errors.blood_type}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-700 ml-1">Units Required</Label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            min="1"
                                            max="20"
                                            placeholder="e.g. 5"
                                            value={data.units_required}
                                            onChange={e => setData('units_required', e.target.value)}
                                            className={cn(
                                                "pl-11 h-14 bg-gray-50/50 border-none rounded-2xl font-bold focus:ring-red-500 transition-all",
                                                errors.units_required ? 'ring-2 ring-red-500' : ''
                                            )}
                                        />
                                    </div>
                                    {errors.units_required && <p className="text-red-600 text-xs font-bold ml-1">{errors.units_required}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-bold text-gray-700 ml-1">Urgency Priority</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {['low', 'medium', 'high', 'critical'].map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setData('urgency_level', level)}
                                            className={cn(
                                                "py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all",
                                                data.urgency_level === level 
                                                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100 scale-105" 
                                                    : "bg-white border-gray-50 text-gray-400 hover:border-gray-100"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-bold text-gray-700 ml-1">Clinical Justification</Label>
                                <Textarea
                                    placeholder="Briefly describe the medical necessity for this request..."
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                    className="min-h-[150px] bg-gray-50/50 border-none rounded-[1.5rem] p-6 text-sm font-medium focus:ring-red-500 transition-all"
                                />
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.blood_type}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs h-16 rounded-full shadow-xl shadow-red-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Broadcasting..." : "Broadcast Emergency Request"}
                                </Button>
                                
                                <div className="mt-8 p-4 bg-blue-50/50 rounded-2xl flex items-start gap-3 border border-blue-100">
                                    <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                        This request will be broadcasted to all eligible donors within the regional network. Ensure all clinical information is verified before transmission.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
