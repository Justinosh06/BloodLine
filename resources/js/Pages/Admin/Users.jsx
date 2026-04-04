import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent } from "@/Components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Users, User, Hospital, Shield, Search, MoreHorizontal, Mail, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function UsersList({ users }) {
    const { patch, processing } = useForm();

    const handleRoleChange = (userId, newRole) => {
        patch(route('admin.users.role', userId), {
            data: { role: newRole },
            preserveScroll: true,
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                            <Users size={14} /> Directory
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
                        <p className="text-gray-500 mt-2 font-medium">Manage permissions and roles across the entire network.</p>
                    </div>
                </div>

                <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-6"
                >
                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2rem] overflow-x-auto">
                        <div className="min-w-[1000px]">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 w-[300px]">Identity</TableHead>
                                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Contact Info</TableHead>
                                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Role / Classification</TableHead>
                                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6">Joined</TableHead>
                                        <TableHead className="font-bold text-gray-500 uppercase text-[10px] tracking-widest p-6 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                            <TableCell className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                                        user.role === 'admin' ? "bg-red-50 text-red-600" : 
                                                        user.role === 'hospital' ? "bg-indigo-50 text-indigo-600" : 
                                                        "bg-blue-50 text-blue-600"
                                                    )}>
                                                        {user.role === 'admin' ? <Shield size={20} /> : 
                                                         user.role === 'hospital' ? <Hospital size={20} /> : 
                                                         <User size={20} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone size={14} className="text-gray-400" />
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <Select
                                                    defaultValue={user.role}
                                                    onValueChange={(val) => handleRoleChange(user.id, val)}
                                                    disabled={processing}
                                                >
                                                    <SelectTrigger className={cn(
                                                        "w-[140px] h-9 border-none font-bold text-[10px] uppercase tracking-wider rounded-full",
                                                        user.role === 'admin' ? "bg-red-100 text-red-700" : 
                                                        user.role === 'hospital' ? "bg-indigo-100 text-indigo-700" : 
                                                        "bg-blue-100 text-blue-700"
                                                    )}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                        <SelectItem value="donor" className="text-[10px] font-bold uppercase tracking-widest">Donor</SelectItem>
                                                        <SelectItem value="hospital" className="text-[10px] font-bold uppercase tracking-widest">Hospital</SelectItem>
                                                        <SelectItem value="admin" className="text-[10px] font-bold uppercase tracking-widest text-red-600">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="p-6">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                    <Calendar size={14} className="text-gray-300" />
                                                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </TableCell>
                                            <TableCell className="p-6 text-right">
                                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white hover:shadow-md transition-all">
                                                    <MoreHorizontal size={18} className="text-gray-400" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AdminLayout>
    );
}
