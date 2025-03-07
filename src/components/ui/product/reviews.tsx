"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/ui/star-rating";
import { Button, Typography } from "@/components";
import { MessageSquare, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import Image from "next/image";
import { useCreateReview, useGetProductReviews } from "@/actions";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  score: number;
  comment: string;
  title: string;
  pros: string[];
  cons: string[];
  createdAt: string;
}

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
  const [newReview, setNewReview] = useState({
    score: 0,
    title: "",
    comment: "",
    pros: "",
    cons: "",
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
      const prosArray = newReview.pros
        ? newReview.pros
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      const consArray = newReview.cons
        ? newReview.cons
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      toast.promise(
        createReview(
          productId,
          newReview.score,
          newReview.title,
          newReview.comment,
          prosArray,
          consArray,
        ),
        {
          success: () => {
            setNewReview({
              score: 0,
              title: "",
              comment: "",
              pros: "",
              cons: "",
            });

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
      setShowReviewForm(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error || "Failed to submit review");
      } else {
        toast.error("Failed to submit review");
      }
    }
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
                <textarea
                  name="pros"
                  className="mb-4 w-full resize-none rounded-lg border p-3 focus:outline-primary"
                  rows={2}
                  placeholder="What did you like about the product? (Separate multiple pros with commas)"
                  value={newReview.pros}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <Typography variant="p-14" className="mb-2">
                  Cons (optional)
                </Typography>
                <textarea
                  name="cons"
                  className="mb-4 w-full resize-none rounded-lg border p-3 focus:outline-primary"
                  rows={2}
                  placeholder="What could be improved? (Separate multiple cons with commas)"
                  value={newReview.cons}
                  onChange={handleInputChange}
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
          {reviewsData.map((review: Review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      {review.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <Typography variant="p-12" className="font-medium">
                    {review.user.name || "Anonymous User"}
                  </Typography>
                </div>
                <StarRating average={review.score} />
              </div>
              <Typography variant="h6" className="mb-2 font-semibold">
                {review.title}
              </Typography>
              <Typography variant="p-14" className="mb-2 text-gray-700">
                {review.comment}
              </Typography>

              {review.pros && review.pros.length > 0 && (
                <div className="mb-2">
                  <Typography
                    variant="p-12"
                    className="font-medium text-green-600"
                  >
                    <ThumbsUp size={16} className="mr-2 inline-block" />
                    Pros
                  </Typography>
                  <Typography variant="p-14" className="text-gray-700">
                    {review.pros.join(", ")}
                  </Typography>
                </div>
              )}

              {review.cons && review.cons.length > 0 && (
                <div className="mb-2">
                  <Typography
                    variant="p-12"
                    className="font-medium text-red-600"
                  >
                    <ThumbsDown size={16} className="mr-2 inline-block" />
                    Cons
                  </Typography>
                  <Typography variant="p-14" className="text-gray-700">
                    {review.cons.join(", ")}
                  </Typography>
                </div>
              )}

              <Typography
                variant="p-12"
                className="mt-2 text-right text-gray-500"
              >
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductReviews };
