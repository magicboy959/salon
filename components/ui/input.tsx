import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-gold/25 bg-white px-3 text-sm text-foreground outline-none transition placeholder:text-zinc-400 focus:border-gold",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
