import { Globe2, MapPin, User } from "lucide-react";
import { PassengerTier } from "@shared/types/enums";
import { formatPassengerTier } from "@shared/utils";
import { cn } from "@shared/utils/cn";

const CONFIG = {
  [PassengerTier.CITIZEN]: {
    icon: User,
    className: "bg-status-completed/10 text-status-completed",
  },
  [PassengerTier.RESIDENT]: {
    icon: MapPin,
    className: "bg-status-confirmed/10 text-status-confirmed",
  },
  [PassengerTier.INTERNATIONAL]: {
    icon: Globe2,
    className: "bg-status-in_progress/10 text-status-in_progress",
  },
};

/**
 * @param {{ tier: string }} props
 */
export default function TierBadge({ tier }) {
  const config = CONFIG[tier] ?? CONFIG[PassengerTier.CITIZEN];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {formatPassengerTier(tier)}
    </span>
  );
}
