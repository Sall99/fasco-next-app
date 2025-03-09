import { motion } from "framer-motion";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Calendar, CheckCircle } from "lucide-react";
import { Review } from "@/types";
import { HelpfulButton } from "../helpful/helpful";

interface ReviewCardProps {
  review: Review;
  voteData: { reviewId: string; isHelpful: boolean }[];
  onVoteChange: (reviewId: string, newCount: number) => void;
}

export const ReviewCard = ({
  review,
  voteData,
  onVoteChange,
}: ReviewCardProps) => {
  const userVote = voteData.find((vote) => vote.reviewId === review.id);
  const isHelpful = userVote?.isHelpful || false;

  const handleVoteChange = (newCount: number) => {
    onVoteChange(review.id, newCount);
  };

  return (
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
                width={48}
                height={48}
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
        <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>

        <p className="leading-relaxed text-gray-700">{review.comment}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {review.pros && review.pros.length > 0 && (
            <div className="rounded-lg bg-green-50 p-4">
              <div className="mb-2 flex items-center">
                <ThumbsUp className="mr-2 text-green-600" size={18} />
                <h4 className="font-semibold text-green-800">Pros</h4>
              </div>
              <ul className="space-y-2">
                {review.pros.map((pro, index) => (
                  <li key={index} className="flex text-sm text-green-700">
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

        <div className="mt-4 flex justify-end">
          <HelpfulButton
            reviewId={review.id}
            initialCount={review.helpfulCount}
            isHelpful={isHelpful}
            onVoteChange={handleVoteChange}
          />
        </div>
      </div>
    </motion.div>
  );
};
