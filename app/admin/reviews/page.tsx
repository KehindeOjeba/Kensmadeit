"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Review {
  id: string;
  productId: string;
  productName?: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, filterStatus]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    if (filterStatus === "pending") {
      filtered = reviews.filter((r) => !r.isApproved);
    } else if (filterStatus === "approved") {
      filtered = reviews.filter((r) => r.isApproved);
    }

    setFilteredReviews(
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    );
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });

      if (!res.ok) throw new Error("Failed to approve review");

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isApproved: true } : r)),
      );
      setSelectedReview(null);
    } catch (err) {
      console.error("Error approving review:", err);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to reject review");

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSelectedReview(null);
    } catch (err) {
      console.error("Error rejecting review:", err);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600 mt-1">
          Approve or reject customer reviews.
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[
              { label: "Pending Approval", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "All Reviews", value: "all" },
            ].map((option) => (
              <Button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                variant={filterStatus === option.value ? "default" : "outline"}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No reviews found</p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card
              key={review.id}
              className={
                review.isApproved ? "" : "border-yellow-200 bg-yellow-50"
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.email}</p>
                      </div>
                      <Badge
                        variant={review.isApproved ? "default" : "secondary"}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg text-yellow-500">
                          {renderStars(review.rating)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {review.rating}/5 Stars
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-700 mt-3">{review.comment}</p>
                    {review.productName && (
                      <p className="text-sm text-gray-600 italic">
                        Product: {review.productName}
                      </p>
                    )}
                  </div>

                  <Dialog
                    open={selectedReview?.id === review.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedReview(null);
                    }}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!review.isApproved && (
                          <>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onClick={() => setSelectedReview(review)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                Approve
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                              onClick={() => handleReject(review.id)}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {review.isApproved && (
                          <DropdownMenuItem
                            onClick={() => handleReject(review.id)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Review</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to approve this review?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <p>
                            <strong>From:</strong> {review.name} ({review.email}
                            )
                          </p>
                          <p>
                            <strong>Rating:</strong>{" "}
                            {renderStars(review.rating)} ({review.rating}/5)
                          </p>
                          <p>
                            <strong>Comment:</strong> {review.comment}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedReview(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleApprove(review.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
