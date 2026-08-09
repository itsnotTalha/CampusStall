import {
  customizationStatusDetails,
  type CustomizationRequestStatus,
} from "@/data/customization-requests";
import { cn } from "@/lib/utils";

export function CustomizationStatusBadge({
  status,
}: {
  status: CustomizationRequestStatus;
}) {
  const detail = customizationStatusDetails[status];

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
