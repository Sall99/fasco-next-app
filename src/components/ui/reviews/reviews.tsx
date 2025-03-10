"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/ui/star-rating";
import { Button, Typography } from "@/components";
import { MessageSquare, Send } from "lucide-react";
import { useCreateReview, useGetProductReviews } from "@/actions";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TagInput } from "../tag-input";
import { Review } from "@/types";
import { ReviewList } from "./review-list";

interface ProductReviewsProps {
  productId: string;
  initialReviews?: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  initialReviews = [],
}) => {
  const { data: session } = useSession();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState<{
    score: number;
    title: string;
    comment: string;
    pros: string[];
    cons: string[];
  }>({
    score: 0,
    title: "",
    comment: "",
    pros: [],
    cons: [],
  });

  const { reviews, isLoading } = useGetProductReviews(productId, 1, 10);
  const reviewsData = reviews || initialReviews;
  const createReview = useCreateReview;

  const hasUserReviewed = React.useMemo(
    () =>
      reviewsData.length > 0 &&
      session?.user &&
      reviewsData.some((review: Review) => review.user.id === session.user.id),
    [reviewsData, session],
  );

  const handleRatingChange = (score: number) => {
    setNewReview((prev) => ({ ...prev, score }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const submitReview = async () => {
    try {
      toast.promise(
        createReview(
          productId,
          newReview.score,
          newReview.title,
          newReview.comment,
          newReview.pros,
          newReview.cons,
        ),
        {
          loading: "Submitting review...",
          success: () => {
            setNewReview({
              score: 0,
              title: "",
              comment: "",
              pros: [],
              cons: [],
            });
            setShowReviewForm(false);
            return "Review submitted successfully";
          },
          error: (error) => {
            if (error instanceof AxiosError) {
              return error.response?.data.error || "Failed to submit review";
            }
            return "Failed to submit review";
          },
        },
      );
    } catch {}
  };

  return (
    <div className="mt-12 rounded-lg bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h6" className="font-bold">
          Customer Reviews
        </Typography>
        {!hasUserReviewed && session?.user && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            <MessageSquare size={16} className="mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-4">
                <Typography variant="p-14" className="mb-2">
                  Your Rating
                </Typography>
                <StarRating
                  average={newReview.score}
                  interactive
                  onRatingChange={handleRatingChange}
                />
              </div>
              <input
                type="text"
                name="title"
                className="mb-4 w-full rounded-lg border p-3 focus:outline-primary"
                placeholder="Review Title"
                value={newReview.title}
                onChange={handleInputChange}
              />
              <textarea
                name="comment"
                className="mb-4 w-full resize-none rounded-lg border p-3 focus:outline-primary"
                rows={4}
                placeholder="Write your detailed review here..."
                value={newReview.comment}
                onChange={handleInputChange}
              />
              <div className="mb-4">
                <Typography variant="p-14" className="mb-2">
                  Pros (optional)
                </Typography>
                <TagInput
                  tags={newReview.pros}
                  setTags={(pros) =>
                    setNewReview((prev) => ({ ...prev, pros }))
                  }
                  placeholder="Type a pro and press Enter (e.g., 'Great quality')"
                  className="mb-4"
                />
              </div>

              <div className="mb-4">
                <Typography variant="p-14" className="mb-2">
                  Cons (optional)
                </Typography>
                <TagInput
                  tags={newReview.cons}
                  setTags={(cons) =>
                    setNewReview((prev) => ({ ...prev, cons }))
                  }
                  placeholder="Type a con and press Enter (e.g., 'Expensive')"
                  className="mb-4"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  size="md"
                  onClick={submitReview}
                  disabled={
                    newReview.score === 0 ||
                    !newReview.title.trim() ||
                    !newReview.comment.trim()
                  }
                >
                  <Send size={16} className="mr-2" />
                  Submit Review
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">
          <Typography variant="p-14">Loading reviews...</Typography>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          <Typography variant="p-14">
            No reviews yet. Be the first to review this product!
          </Typography>
        </div>
      ) : (
        <div className="space-y-4">
          <ReviewList reviews={reviews} />
        </div>
      )}
    </div>
  );
};

export { ProductReviews };
