import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function NavLink({
    active = false,
    className = '',
    children,
    variant = 'default',
    ...props
}) {
    if (variant === 'pill') {
        return (
            <Link
                {...props}
                className={cn(
                    "flex items-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200",
                    active 
                        ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    className
                )}
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            {...props}
            className={cn(
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-bold leading-5 transition duration-150 ease-in-out focus:outline-none',
                active
                    ? 'border-red-600 text-gray-900 focus:border-red-700'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700 focus:border-gray-200 focus:text-gray-700',
                className
            )}
        >
            {children}
        </Link>
    );
}
