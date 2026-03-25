import { Link } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-[#f9fafb] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <aside className="w-64 bg-white border-r border-border p-0 flex flex-col">
                <div className="p-6">
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center rounded-none shadow-sm group-hover:bg-indigo-700 transition-colors">
                            <span className="text-white font-black text-xl">B</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">BloodLine <span className="text-indigo-600 font-black">HQ</span></h1>
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-4">Infrastructure</p>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-none hover:bg-gray-100 hover:text-indigo-600 py-6">
                        <Link href="/admin/dashboard" className="flex items-center gap-3 font-semibold">
                            Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full justify-start rounded-none hover:bg-gray-100 hover:text-indigo-600 py-6">
                        <Link href="/admin/inventory" className="flex items-center gap-3 font-semibold">
                            Live Inventory
                        </Link>
                    </Button>
                </nav>

                <div className="mt-auto p-4 border-t border-border bg-gray-50/50">
                    <Button asChild variant="outline" className="w-full justify-center rounded-none border-gray-200 text-gray-600 hover:bg-white hover:text-red-600 hover:border-red-200 transition-all">
                        <Link href="/logout" method="post" as="button" className="w-full text-center font-bold">Sign Out</Link>
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-12 overflow-auto">{children}</main>
        </div>
    );
}