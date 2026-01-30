import { useState } from "react";
import { Star, ThumbsUp, User, MessageSquare, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Review {
    _id: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    onAddReview?: (rating: number, comment: string) => void;
    isSubmitting?: boolean;
}

const StarRating = ({
    rating,
    interactive = false,
    onRate,
}: {
    rating: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
}) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => onRate?.(star)}
                    className={cn(
                        "transition-colors",
                        interactive && "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            "h-4 w-4",
                            (hovered || rating) >= star
                                ? "fill-accent text-accent"
                                : "text-muted-foreground/30"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};

const ReviewsSection = ({
    reviews,
    averageRating,
    totalReviews,
    onAddReview,
    isSubmitting,
}: ReviewsSectionProps) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [newReview, setNewReview] = useState("");

    const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: reviews.filter((r) => r.rating === stars).length,
        percentage:
            (reviews.filter((r) => r.rating === stars).length / (totalReviews || 1)) * 100,
    }));

    const handleSubmit = () => {
        if (newRating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!newReview.trim()) {
            toast.error("Please enter a comment");
            return;
        }
        onAddReview?.(newRating, newReview);
        // We'll let the parent handle closing form on success via mutation
        if (!isSubmitting) {
            setShowReviewForm(false);
            setNewRating(0);
            setNewReview("");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Customer Reviews</h2>
                <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    Write a Review
                </Button>
            </div>

            {/* Rating Summary */}
            <div className="grid md:grid-cols-2 gap-8 p-6 bg-secondary/50 rounded-xl">
                <div className="text-center md:text-left">
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                        <span className="font-display text-5xl font-bold text-foreground">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">out of 5</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                        <StarRating rating={averageRating} />
                        <span className="text-sm text-muted-foreground">
                            ({totalReviews} reviews)
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {ratingBreakdown.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm w-8">{stars} ★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="p-6 border rounded-xl space-y-4 animate-fade-in">
                    <h3 className="font-medium">Write Your Review</h3>
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Your Rating</label>
                        <StarRating rating={newRating} interactive onRate={setNewRating} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground">Your Review</label>
                        <Textarea
                            placeholder="Share your experience with this product..."
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            className="min-h-[120px]"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button
                            className="btn-gold"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                        <Button variant="ghost" onClick={() => setShowReviewForm(false)}>
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {(reviews || []).map((review) => (
                    <div
                        key={review._id}
                        className="p-6 border rounded-xl space-y-4 hover:border-accent/30 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{review.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>

                        <div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;
