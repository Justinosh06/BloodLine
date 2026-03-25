import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-none border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-primary bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground border-border bg-transparent",
                success: "border-green-200 bg-green-50 text-green-700",
                warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
                danger: "border-red-200 bg-red-50 text-red-700",
                flat: "border-border bg-muted text-muted-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
