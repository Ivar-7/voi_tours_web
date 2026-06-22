import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";

import Select from "@shared/components/ui/Select";
import Input from "@shared/components/ui/Input";
import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
import { formatCurrency } from "@shared/utils";
import { useAuth } from "@features/auth/hooks/useAuth";
import { usePackages } from "@features/packages/hooks/usePackages";
import { usePackagePricing } from "@features/packages/hooks/usePackagePricing";
import { safariBookingSchema } from "../schema/booking.schema";
import { deriveSeasonFromDate } from "../services/booking.service";

const today = new Date().toISOString().slice(0, 10);

/**
 * @param {{ onSubmit: (values: object) => void }} props
 */
export default function SafariBookingForm({ onSubmit }) {
  const [searchParams] = useSearchParams();
  const packageSlug = searchParams.get("package");

  const { user } = useAuth();
  const tier = user?.tier || "citizen";

  const { data: packages = [], isLoading, isError } = usePackages();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(safariBookingSchema),
    defaultValues: { package_id: "", travel_date: "", party_size: 1 },
  });

  useEffect(() => {
    if (!packageSlug || !packages.length) return;
    const match = packages.find((pkg) => pkg.slug === packageSlug);
    if (match) setValue("package_id", match.id, { shouldValidate: true });
  }, [packageSlug, packages, setValue]);

  const packageId = watch("package_id");
  const travelDate = watch("travel_date");
  const partySize = Number(watch("party_size")) || 0;

  const selectedPackage = useMemo(
    () => packages.find((pkg) => pkg.id === packageId),
    [packages, packageId],
  );

  const season = travelDate ? deriveSeasonFromDate(travelDate) : null;
  const { price, currency } = usePackagePricing(
    selectedPackage?.pricing,
    tier,
    season,
  );
  const total = price != null ? price * partySize : null;

  function handleValid(values) {
    onSubmit({
      ...values,
      party_size: Number(values.party_size),
      package_name: selectedPackage?.title,
      season_applied: season,
      total_amount: total,
      currency,
    });
  }

  if (isLoading) {
    return <p className="text-sm text-text-muted">Loading packages…</p>;
  }

  if (isError) {
    return (
      <Alert variant="error" title="Couldn't load packages">
        Please refresh the page and try again.
      </Alert>
    );
  }

  if (!packages.length) {
    return (
      <Alert variant="info" title="No safari packages available">
        Check back soon, or browse our other services.
      </Alert>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleValid)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Select
        label="Safari package"
        placeholder="Choose a package"
        options={packages.map((pkg) => ({ value: pkg.id, label: pkg.title }))}
        error={errors.package_id?.message}
        {...register("package_id")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="date"
          label="Travel date"
          min={today}
          error={errors.travel_date?.message}
          {...register("travel_date")}
        />
        <Input
          type="number"
          min={1}
          label="Party size"
          error={errors.party_size?.message}
          {...register("party_size", { valueAsNumber: true })}
        />
      </div>

      {selectedPackage && travelDate ? (
        <div className="rounded-card border border-border bg-surface-raised p-4">
          {price != null ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {formatCurrency(price, currency)} × {partySize || 1}{" "}
                {partySize === 1 ? "person" : "people"} ({season} season)
              </span>
              <span className="text-lg font-semibold text-text-primary">
                {formatCurrency(total, currency)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-text-muted">
              No {tier} / {season} pricing is set for this package yet. Our team
              will confirm pricing after you submit.
            </p>
          )}
        </div>
      ) : null}

      <Button type="submit">Continue</Button>
    </form>
  );
}
