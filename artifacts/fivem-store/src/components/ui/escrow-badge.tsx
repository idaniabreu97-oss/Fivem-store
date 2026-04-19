import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface EscrowBadgeProps {
  className?: string;
  showText?: boolean;
}

export function EscrowBadge({ className, showText = true }: EscrowBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-escrow/10 px-2.5 py-0.5 text-xs font-semibold text-escrow ring-1 ring-inset ring-escrow/20",
        className
      )}
    >
      <Shield className="h-3.5 w-3.5" />
      {showText && <span>Escrow Protected</span>}
    </div>
  );
}
