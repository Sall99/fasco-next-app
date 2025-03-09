import { useState } from "react";
import { Review } from "@/types";
import { ReviewCard } from "./review-card";
import { useGetHelpfulVotes } from "@/actions";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList = ({ reviews }: ReviewListProps) => {
  const [reviewsData, setReviewsData] = useState<Review[]>(reviews);

  const reviewIds = reviews.map((review) => review.id);

  const { data: votesData, isLoading } = useGetHelpfulVotes(reviewIds);

  const handleVoteChange = (reviewId: string, newCount: number) => {
    setReviewsData((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, helpfulCount: newCount } : review,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500">Loading reviews...</div>
    );
  }

  return (
    <div className="space-y-6">
      {reviewsData.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          voteData={votesData || []}
          onVoteChange={handleVoteChange}
        />
      ))}
    </div>
  );
};
