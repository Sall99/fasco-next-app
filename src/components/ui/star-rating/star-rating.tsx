"use client";
import { Typography } from "@/components";
import clsx from "clsx";
import { Star } from "lucide-react";
import React, { useState } from "react";

interface StarRatingProps {
  average?: number;
  rating?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  average,
  rating,
  interactive = false,
  onRatingChange,
  size = 18,
  className = "",
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const roundedAverage = average !== undefined ? Math.round(average) : 0;
  const currentRating = rating || hoverRating || roundedAverage;

  const handleStarHover = (index: number) => {
    if (interactive) {
      setHoverRating(index + 1);
    }
  };

  const handleStarLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      const newRating = index + 1;
      onRatingChange(newRating);
    }
  };

  return (
    <div className={clsx("flex items-center space-x-2", className)}>
      <div className={clsx("flex gap-1")}>
        {[...Array(5)].map((_, index) => {
          const isFilled =
            index < currentRating || (interactive && index < hoverRating);

          return (
            <Star
              key={index}
              color={isFilled ? "#FF8D4D" : "#E0E0E0"}
              fill={isFilled ? "#FF8D4D" : "none"}
              size={size}
              className={clsx(
                "transition-all duration-200",
                interactive && "cursor-pointer hover:scale-110 active:scale-95",
                isFilled ? "text-orange-500" : "text-gray-300",
              )}
              onMouseEnter={() => handleStarHover(index)}
              onMouseLeave={handleStarLeave}
              onClick={() => handleStarClick(index)}
            />
          );
        })}
      </div>
      {(rating || average) && (
        <Typography variant="p-12" className="text-gray-600">
          ({(rating || average || 0).toFixed(1)}/5)
        </Typography>
      )}
    </div>
  );
};
