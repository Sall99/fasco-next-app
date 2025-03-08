"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarRating } from "@/components/ui/star-rating";
import { Button, Typography } from "@/components";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { useCreateReview, useGetProductReviews } from "@/actions";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { TagInput } from "../tag-input";
import { Review } from "@/types";

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
          {reviewsData.map((review: Review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  {review.user.image ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
                      <Image
                        src={review.user.image}
                        alt={review.user.name || "User"}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary/40 text-lg font-semibold text-white">
                      {review.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {review.user.name || "Anonymous User"}
                    </h4>
                    {review.verifiedPurchase && (
                      <div className="mt-1 flex items-center text-xs text-green-600">
                        <CheckCircle size={12} className="mr-1" />
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.score ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {review.title}
                </h3>

                <p className="leading-relaxed text-gray-700">
                  {review.comment}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {review.pros && review.pros.length > 0 && (
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="mb-2 flex items-center">
                        <ThumbsUp className="mr-2 text-green-600" size={18} />
                        <h4 className="font-semibold text-green-800">Pros</h4>
                      </div>
                      <ul className="space-y-2">
                        {review.pros.map((pro, index) => (
                          <li
                            key={index}
                            className="flex text-sm text-green-700"
                          >
                            <span className="mr-2">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div className="rounded-lg bg-red-50 p-4">
                      <div className="mb-2 flex items-center">
                        <ThumbsDown className="mr-2 text-red-600" size={18} />
                        <h4 className="font-semibold text-red-800">Cons</h4>
                      </div>
                      <ul className="space-y-2">
                        {review.cons.map((con, index) => (
                          <li key={index} className="flex text-sm text-red-700">
                            <span className="mr-2">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-4 text-sm">
                  <button className="flex items-center text-gray-500 transition-colors hover:text-primary">
                    <ThumbsUp size={14} className="mr-1" />
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ProductReviews };
