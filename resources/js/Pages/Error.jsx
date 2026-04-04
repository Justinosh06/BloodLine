import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function Error({ status }) {
  const title = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }[status] || 'Error';

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[status] || 'An unexpected error occurred.';

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 font-sans antialiased">
      <Head title={title} />
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="h-24 w-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-red-100/50">
          <AlertTriangle size={48} />
        </div>
        
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
          <p className="text-gray-500 mt-4 font-medium text-lg">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline"
            className="flex-1 h-12 rounded-full border-gray-200 font-bold hover:bg-white hover:border-gray-300 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Link href="/" className="flex-1">
            <Button className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-lg shadow-red-100 transition-all">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
