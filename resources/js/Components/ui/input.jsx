import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, label, errorMessage, isInvalid, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-none border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    isInvalid && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                {...props}
            />
            {isInvalid && errorMessage && (
                <p className="text-xs font-medium text-destructive">{errorMessage}</p>
            )}
        </div>
    )
})
Input.displayName = "Input"

export { Input }
