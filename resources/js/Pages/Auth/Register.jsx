import React from 'react';
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
import { Heart, Mail, Lock, User, Phone, ArrowRight, Hospital } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
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
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
            >
                <div className="text-center space-y-2">
                    <div className="flex justify-center">
                        <div className="bg-red-600 p-3 rounded-2xl shadow-lg">
                            <Heart className="h-8 w-8 text-white fill-current" />
                        </div>
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="text-sm text-gray-600">
                        Join the network and help save lives.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">I am a...</label>
                        <RadioGroup
                            value={data.role}
                            onValueChange={(val) => setData('role', val)}
                            className="grid grid-cols-2 gap-3"
                        >
                            <div 
                                className={`relative flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${data.role === 'donor' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`} 
                                onClick={() => setData('role', 'donor')}
                            >
                                <RadioGroupItem value="donor" className="sr-only" />
                                <div className="flex flex-col items-center gap-1">
                                    <User size={20} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Donor</span>
                                </div>
                            </div>
                            <div 
                                className={`relative flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${data.role === 'hospital' ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'}`} 
                                onClick={() => setData('role', 'hospital')}
                            >
                                <RadioGroupItem value="hospital" className="sr-only" />
                                <div className="flex flex-col items-center gap-1">
                                    <Hospital size={20} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Hospital</span>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                required
                                placeholder={data.role === 'donor' ? "John Doe" : "City Central Hospital"}
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="pl-9"
                                isInvalid={!!errors.name}
                            />
                        </div>
                        {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                required
                                type="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="pl-9"
                                isInvalid={!!errors.email}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    required
                                    placeholder="+1..."
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="pl-9"
                                    isInvalid={!!errors.phone}
                                />
                            </div>
                            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                        </div>

                        {data.role === 'donor' && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Blood Type</label>
                                <Select
                                    value={data.blood_type}
                                    onValueChange={(val) => setData('blood_type', val)}
                                >
                                    <SelectTrigger className="h-10 border-gray-100 focus:ring-red-600">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.blood_type && <p className="text-xs text-red-600">{errors.blood_type}</p>}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="pl-9"
                                isInvalid={!!errors.password}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                required
                                type="password"
                                placeholder="••••••••"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <Checkbox
                        required
                        id="terms"
                        className="mt-1"
                    >
                        <span className="text-xs text-gray-600 leading-normal cursor-pointer">
                            I agree to the <Link className="font-semibold text-red-600 hover:underline">Terms of Service</Link> and <Link className="font-semibold text-red-600 hover:underline">Privacy Policy</Link>.
                        </span>
                    </Checkbox>

                    <Button
                        type="submit"
                        className="w-full h-11 text-sm font-bold bg-red-600 hover:bg-red-700 border-none text-white"
                        disabled={processing}
                    >
                        {processing ? "Creating Account..." : "Join BloodLine"}
                        {!processing && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-red-600 hover:text-red-700">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </GuestLayout>
    );
}
