"use client";
import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useHelpfulVote } from "@/actions";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface HelpfulButtonProps {
  reviewId: string;
  initialCount: number;
  isHelpful: boolean;
  onVoteChange: (newCount: number) => void;
}

export const HelpfulButton = ({
  reviewId,
  initialCount,
  isHelpful,
  onVoteChange,
}: HelpfulButtonProps) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(initialCount);
  const [isVoted, setIsVoted] = useState<boolean>(isHelpful);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const helpfulVote = useHelpfulVote;

  const handleVote = async () => {
    try {
      setIsLoading(true);
      const response = await helpfulVote(reviewId, !isVoted);

      if (response && response.vote) {
        const newCount = !isVoted ? helpfulCount + 1 : helpfulCount - 1;
        setHelpfulCount(newCount);
        setIsVoted(!isVoted);
        onVoteChange(newCount);
        toast.success(response.message || "Vote updated successfully");
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(
        (error as AxiosError<{ error: string }>)?.response?.data?.error ||
          "An error occurred",
      );
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition-colors ${
        isVoted
          ? "bg-primary/10 text-primary"
          : "text-gray-500 hover:bg-primary/5 hover:text-primary"
      } ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      aria-label={isVoted ? "Remove helpful vote" : "Mark as helpful"}
    >
      <ThumbsUp size={14} className={isVoted ? "fill-primary" : ""} />
      <span>{`Helpful${helpfulCount > 0 ? ` (${helpfulCount})` : ""}`}</span>
    </button>
  );
};
