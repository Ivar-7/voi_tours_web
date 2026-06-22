import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Textarea from "@shared/components/ui/Textarea";
import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
import { useAuth } from "@features/auth/hooks/useAuth";
import { reviewSchema } from "../schema/review.schema";
import { useSubmitReview } from "../hooks/useSubmitReview";
import StarRating from "./StarRating";

/**
 * @param {{ packageId?: string, destinationId?: string, onSuccess?: () => void }} props
 */
export default function ReviewForm({ packageId, destinationId, onSuccess }) {
  const { isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      package_id: packageId,
      destination_id: destinationId,
    },
  });

  const { mutate, isPending, isError, error } = useSubmitReview();

  if (!isAuthenticated) {
    return (
      <Alert variant="info" title="Sign in to leave a review">
        Create an account or sign in to share your experience.
      </Alert>
    );
  }

  if (submitted) {
    return (
      <Alert variant="success" title="Thanks for your review!">
        Your feedback helps other travelers plan their trip.
      </Alert>
    );
  }

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => {
        reset();
        setSubmitted(true);
        onSuccess?.();
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <div>
        <p className="mb-1.5 text-sm font-medium text-text-primary">
          Your rating
        </p>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating value={field.value} onChange={field.onChange} size="lg" />
          )}
        />
        {errors.rating ? (
          <p className="mt-1.5 text-xs text-status-cancelled">
            Select a star rating.
          </p>
        ) : null}
      </div>

      <Textarea
        label="Your experience"
        rows={4}
        hint="At least 10 characters."
        error={errors.comment?.message}
        {...register("comment")}
      />

      {isError ? (
        <Alert variant="error" title="Couldn't submit your review">
          {error?.message ?? "Please try again."}
        </Alert>
      ) : null}

      <Button type="submit" loading={isPending}>
        Submit review
      </Button>
    </form>
  );
}
