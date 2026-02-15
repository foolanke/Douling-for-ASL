import * as React from "react";
import { cn } from "./utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-[#4A4A48]/30", className)}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-[#566246] to-[#A4C2A5] transition-[width]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
