
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ListProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'warning' | 'info';
}

export function List({ children, className, variant = 'default' }: ListProps) {
  return (
    <ul
      className={cn(
        "space-y-2 list-disc pl-5 marker:text-primary",
        variant === 'warning' && "marker:text-yellow-500",
        variant === 'info' && "marker:text-blue-500",
        className
      )}
    >
      {children}
    </ul>
  );
}

interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn("leading-relaxed", className)}>
      {children}
    </li>
  );
}

    