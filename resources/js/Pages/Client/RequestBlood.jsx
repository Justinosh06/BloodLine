import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Activity, AlertCircle, ChevronRight, Zap } from "lucide-react";

export default function RequestBlood() {
    const { data, setData, post, processing, errors } = useForm({
        blood_type: '',
        units_required: '',
        urgency_level: 'medium',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('requests.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Infrastructure <ChevronRight size={10} /> Emergency Protocol
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Request Resource</h2>
                </div>
            }
        >
            <Head title="Request Blood" />

            <div className="max-w-2xl mx-auto py-8">
                <Card className="border-border bg-white shadow-none rounded-none">
                    <CardHeader className="pb-8 pt-10 px-10 border-b border-border bg-gray-50/30">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                            <Zap size={14} /> Priority Transmission
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight text-gray-900">Initiate Payload</CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Broadcast biological requirements to the distributed node network.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10">
                        <form onSubmit={submit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Biological Type</label>
                                <Select
                                    value={data.blood_type}
                                    onValueChange={val => setData('blood_type', val)}
                                >
                                    <SelectTrigger className={`h-12 bg-gray-50/50 border-border rounded-none font-bold ${errors.blood_type ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select type..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-border">
                                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(t => (
                                            <SelectItem key={t} value={t} className="font-bold rounded-none">{t} Group</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.blood_type && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.blood_type}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource Load (Units)</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="0"
                                        value={data.units_required}
                                        onChange={e => setData('units_required', e.target.value)}
                                        className={`h-12 bg-gray-50/50 border-border rounded-none font-bold ${errors.units_required ? 'border-red-500' : ''}`}
                                    />
                                    {errors.units_required && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.units_required}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency Priority</label>
                                    <Select
                                        value={data.urgency_level}
                                        onValueChange={val => setData('urgency_level', val)}
                                    >
                                        <SelectTrigger className="h-12 bg-gray-50/50 border-border rounded-none font-bold">
                                            <SelectValue placeholder="Priority Level..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none border-border">
                                            <SelectItem value="critical" className="font-bold rounded-none">Level 1: Critical</SelectItem>
                                            <SelectItem value="high" className="font-bold rounded-none">Level 2: High</SelectItem>
                                            <SelectItem value="medium" className="font-bold rounded-none">Level 3: Medium</SelectItem>
                                            <SelectItem value="low" className="font-bold rounded-none">Level 4: Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Justification</label>
                                <Textarea
                                    placeholder="Clinical notes, patient status, or infrastructure requirements..."
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                    className="min-h-[120px] bg-gray-50/50 border-border rounded-none p-4 text-sm font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-none shadow-none transition-all active:scale-[0.98]"
                                >
                                    {processing ? "Creating Request..." : "Create Blood Request"}
                                </Button>
                                <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                                    <AlertCircle className="h-3 w-3" /> Secure Node Transmission Guaranteed
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
