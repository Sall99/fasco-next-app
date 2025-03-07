import { prisma } from "../../libs";

export const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export async function calculateProductRatingAverage(
  ratingId: string,
): Promise<number> {
  const averageRating = await prisma.review.aggregate({
    where: { ratingId },
    _avg: { score: true },
  });

  return averageRating._avg.score || 0;
}
