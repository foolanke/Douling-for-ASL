import * as React from "react";
import { cn } from "./utils";

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "icon";

const baseClasses =
  "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
