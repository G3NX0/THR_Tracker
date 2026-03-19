import * as React from "react";

import { cn } from "@/utils/cn";

const badgeVariants = {
  default: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  masuk: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  keluar: "bg-amber-100 text-amber-800 border border-amber-300",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
