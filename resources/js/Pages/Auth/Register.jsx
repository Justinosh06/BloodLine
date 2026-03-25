import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import GuestLayout from '@/Layouts/GuestLayout';
import { ChevronRight, Shield, User, Landmark, ArrowRight, Activity } from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'donor', // donor or hospital
        blood_type: '',
        phone: '',
    });

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Sequential Registration" />

            <div className="w-full">
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        <Activity size={10} /> Network Integration
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">New Node Registry</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Initialize link with the biological grid.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-8">
                    {/* Role Selection Matrix */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Entity Classification</label>
                        <RadioGroup
                            value={data.role}
                            onValueChange={(val) => setData('role', val)}
                            className="flex gap-4"
                        >
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 border border-border cursor-pointer transition-all ${data.role === 'donor' ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:bg-gray-50'}`}>
                                <RadioGroupItem value="donor" className="sr-only" />
                                <User size={14} className={data.role === 'donor' ? 'text-indigo-600' : 'text-gray-400'} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${data.role === 'donor' ? 'text-indigo-700' : 'text-gray-500'}`}>Donor_Unit</span>
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 p-4 border border-border cursor-pointer transition-all ${data.role === 'hospital' ? 'bg-indigo-50 border-indigo-200' : 'bg-white hover:bg-gray-50'}`}>
                                <RadioGroupItem value="hospital" className="sr-only" />
                                <Landmark size={14} className={data.role === 'hospital' ? 'text-indigo-600' : 'text-gray-400'} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${data.role === 'hospital' ? 'text-indigo-700' : 'text-gray-500'}`}>Hospital_Node</span>
                            </label>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            required
                            label={data.role === 'donor' ? "UNIT_ID_NAME" : "NODE_DESIGNATION"}
                            placeholder={data.role === 'donor' ? "John Doe" : "City Central"}
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            isInvalid={!!errors.name}
                            errorMessage={errors.name}
                            className="rounded-none shadow-none"
                        />
                        <Input
                            required
                            label="COMM_CHANNEL_EMAIL"
                            type="email"
                            placeholder="identity@grid.local"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email}
                            className="rounded-none shadow-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="UPLINK_TELEMETRY_PHONE"
                            placeholder="+10000000000"
                            value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className="rounded-none shadow-none"
                        />
                        {data.role === 'donor' && (
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Biological_Band</label>
                                <Select
                                    value={data.blood_type}
                                    onValueChange={(val) => setData('blood_type', val)}
                                >
                                    <SelectTrigger className="rounded-none shadow-none border-border h-10 text-[10px] font-black uppercase">
                                        <SelectValue placeholder="SELECT_BAND" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none shadow-none border-border">
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="text-[10px] font-black">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                        <Input
                            required
                            label="SECURE_PHRASE"
                            type="password"
                            placeholder="••••••••"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            isInvalid={!!errors.password}
                            errorMessage={errors.password}
                            className="rounded-none shadow-none"
                        />
                        <Input
                            required
                            label="VALIDATE_PHRASE"
                            type="password"
                            placeholder="••••••••"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="rounded-none shadow-none"
                        />
                    </div>

                    <Checkbox
                        required
                        className="rounded-none"
                    >
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            ACKNOWLEDGE <Link className="text-indigo-600 underline">NETWORK_PROTOCOLS</Link>
                        </span>
                    </Checkbox>

                    <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-black text-[10px] uppercase tracking-widest h-12 shadow-none flex items-center justify-center gap-2"
                        disabled={processing}
                    >
                        {processing ? "SYNCING..." : (data.role === 'donor' ? 'INTEGRATE_UNIT' : 'INTEGRATE_NODE')} <ArrowRight size={14} />
                    </Button>

                    <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Already Synchronized? <Link href="/login" className="text-indigo-600 hover:underline">Access Portal</Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}

