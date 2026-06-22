import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@shared/utils/cn";

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

/**
 * @param {{ value: number, onChange?: (value: number) => void, readOnly?: boolean, size?: 'sm'|'md'|'lg' }} props
 */
export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "md",
}) {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered || value;

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(0)}
      role={readOnly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          className={cn(
            "text-amber-400",
            readOnly ? "cursor-default" : "cursor-pointer",
          )}
        >
          <Star
            className={sizes[size] ?? sizes.md}
            fill={star <= displayValue ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
