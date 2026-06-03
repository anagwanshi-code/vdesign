"use client";

import { cn } from "@/lib/utils/cn";
import { useId, useState } from "react";

type ProductDescriptionExpandableProps = {
  description: string;
  className?: string;
};

export function ProductDescriptionExpandable({
  description,
  className,
}: ProductDescriptionExpandableProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();
  const isLong = description.trim().length > 180;

  return (
    <div className={className}>
      <p
        id={contentId}
        className={cn(
          "max-w-prose font-sans text-base leading-7 text-gray-600",
          !expanded && isLong && "line-clamp-3",
        )}
      >
        {description}
      </p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 font-sans text-sm font-semibold text-pink-600 transition-colors hover:text-pink-700"
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      ) : null}
    </div>
  );
}
