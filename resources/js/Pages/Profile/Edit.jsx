import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronRight } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        System <ChevronRight size={10} /> Account Identity
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">User Terminal</h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">Configure security parameters and credentials.</p>
                </div>
            }
        >
            <Head title="Account Configuration" />

            <div className="space-y-12">
                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden">
                    <div className="h-1 w-full bg-indigo-600" />
                    <CardContent className="p-8 sm:p-12">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </CardContent>
                </Card>

                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden border-orange-200">
                    <div className="h-1 w-full bg-orange-500" />
                    <CardContent className="p-8 sm:p-12">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </CardContent>
                </Card>

                <Card className="border-border bg-white shadow-none rounded-none overflow-hidden border-red-200">
                    <div className="h-1 w-full bg-red-600" />
                    <CardContent className="p-8 sm:p-12">
                        <DeleteUserForm className="max-w-2xl" />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

