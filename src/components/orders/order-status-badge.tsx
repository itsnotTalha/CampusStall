import { orderStatusDetails, type OrderStatus } from "@/data/orders";
import { cn } from "@/lib/utils";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const detail = orderStatusDetails[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase",
        detail.style,
      )}
    >
      {detail.label}
    </span>
  );
}
