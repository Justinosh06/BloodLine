import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent } from "@/Components/ui/card";
import { User, Shield, Trash2, Settings, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Edit({ mustVerifyEmail, status }) {
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
                        <Settings size={14} /> System Preferences
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Account Settings</h2>
                    <p className="text-gray-500 mt-2 font-medium">Manage your profile, security, and account preferences.</p>
                </div>
            }
        >
            <Head title="Account Settings" />

            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto space-y-10 pb-20"
            >
                <motion.div variants={item}>
                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 sm:p-12">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Information</h3>
                                    <p className="text-sm text-gray-500 font-medium">Update your account's profile information and email address.</p>
                                </div>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-none bg-white shadow-xl shadow-gray-100/50 rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 sm:p-12">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Password</h3>
                                    <p className="text-sm text-gray-500 font-medium">Ensure your account is using a long, random password to stay secure.</p>
                                </div>
                            </div>
                            <UpdatePasswordForm />
                        </div>
                    </Card>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-none bg-red-50 shadow-none rounded-[2.5rem] overflow-hidden border border-red-100">
                        <div className="p-8 sm:p-12">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-red-900 tracking-tight">Danger Zone</h3>
                                    <p className="text-sm text-red-600/70 font-medium">Once you delete your account, all of its resources and data will be permanently deleted.</p>
                                </div>
                            </div>
                            <DeleteUserForm />
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
