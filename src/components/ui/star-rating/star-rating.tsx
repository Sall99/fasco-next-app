"use client";
import { Typography } from "@/components";
import clsx from "clsx";
import { Star } from "lucide-react";

export const StarRating = ({
  rating,
  average,
}: {
  rating?: number;
  average: number;
}) => {
  const roundedAverage = Math.round(average);

  return (
    <div className="flex items-center space-x-1">
      <div className={clsx("flex gap-2")}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            color={index < roundedAverage ? "#FF8D4D" : "#E0E0E0"}
            fill={index < roundedAverage ? "#FF8D4D" : "none"}
            size={18}
          />
        ))}
      </div>
      {rating && <Typography variant="p-12">({rating}/5)</Typography>}
    </div>
  );
};
