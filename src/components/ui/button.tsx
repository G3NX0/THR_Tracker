import * as React from "react";

import { cn } from "@/utils/cn";

const buttonVariants = {
  default:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500",
  outline:
    "border border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-400",
  ghost:
    "text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-400",
  destructive:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-400",
} as const;

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-9 rounded-lg px-3 text-xs",
  lg: "h-11 rounded-xl px-6 text-sm",
  icon: "h-10 w-10",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        ref={ref}
        type={type ?? "button"}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
