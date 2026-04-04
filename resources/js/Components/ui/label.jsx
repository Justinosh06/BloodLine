import React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef(function Label(
    { className, ...props },
    ref
) {
    return (
        <label
            ref={ref}
            className={cn(
                "text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700",
                className
            )}
            {...props}
        />
    );
});

