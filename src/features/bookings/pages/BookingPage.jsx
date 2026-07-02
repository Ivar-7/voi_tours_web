import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
import { cn } from "@shared/utils/cn";
import { useAuth } from "@features/auth/hooks/useAuth";
import { formatServiceType } from "@shared/utils";
import { ServiceType } from "@shared/types/enums";

import BookingStepper from "../components/BookingStepper";
import BookingReview from "../components/BookingReview";
import SafariBookingForm from "../components/SafariBookingForm";
import TransferBookingForm from "../components/TransferBookingForm";
import HotelBookingForm from "../components/HotelBookingForm";
import EventBookingForm from "../components/EventBookingForm";
import DeliveryBookingForm from "../components/DeliveryBookingForm";
import { useCreateBooking } from "../hooks/useCreateBooking";
import { buildBookingPayload } from "../services/booking.service";
import {
  BOOKING_FLOW_POINTS,
  BOOKING_SERVICE_OPTIONS,
  getBookingServiceMeta,
} from "../utils/bookingUi";

const VALID_TYPES = new Set(Object.values(ServiceType));

function renderForm(type, onSubmit) {
  switch (type) {
    case ServiceType.SAFARI:
      return <SafariBookingForm onSubmit={onSubmit} />;
    case ServiceType.SGR_TRANSFER:
      return (
        <TransferBookingForm
          onSubmit={onSubmit}
          type={ServiceType.SGR_TRANSFER}
        />
      );
    case ServiceType.FLIGHT:
      return (
        <TransferBookingForm onSubmit={onSubmit} type={ServiceType.FLIGHT} />
      );
    case ServiceType.HOTEL:
      return <HotelBookingForm onSubmit={onSubmit} />;
    case ServiceType.EVENT:
      return <EventBookingForm onSubmit={onSubmit} />;
    case ServiceType.DELIVERY:
      return <DeliveryBookingForm onSubmit={onSubmit} />;
    default:
      return null;
  }
}

function ServiceChooser() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
            New booking
          </p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-stone-950 dark:text-stone-50 sm:text-4xl">
            What do you need booked?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
            Pick a service, add the operational details, and track the request
            from your bookings dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Booking flow
          </p>
          <div className="mt-4 space-y-3">
            {BOOKING_FLOW_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                      {point.title}
                    </p>
                    <p className="text-xs leading-5 text-stone-500 dark:text-stone-400">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BOOKING_SERVICE_OPTIONS.map((service) => {
          const Icon = service.icon;
          return (
            <Link
              key={service.type}
              to={`/dashboard/book/${service.type}`}
              className="group rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-50/40 dark:border-stone-800 dark:bg-stone-900/70 dark:hover:border-amber-500/60 dark:hover:bg-amber-950/10"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    service.accent,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowRight className="h-4 w-4 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-amber-600 dark:group-hover:text-amber-300" />
              </div>
              <h2 className="mt-5 text-base font-semibold text-stone-950 dark:text-stone-50">
                {service.label}
              </h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-stone-600 dark:text-stone-400">
                {service.description}
              </p>
              <div className="mt-5 rounded-xl bg-stone-50 p-3 dark:bg-stone-950/60">
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {service.detail}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

export default function BookingPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);

  const { mutate, isPending, isError, error } = useCreateBooking();
  const serviceMeta = getBookingServiceMeta(type);
  const ServiceIcon = serviceMeta.icon;

  if (!type) {
    return <ServiceChooser />;
  }

  if (!VALID_TYPES.has(type)) {
    return (
      <div className="mx-auto max-w-2xl">
        <Alert variant="error" title="Unknown service">
          "{type}" isn't a service we offer.
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate("/dashboard/bookings")}
        >
          Back to my bookings
        </Button>
      </div>
    );
  }

  function handleStepOneSubmit(values) {
    setFormData(values);
    setStep(2);
  }

  function handleConfirm() {
    const payload = buildBookingPayload(type, formData, user);
    mutate(payload);
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/book"
        className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Choose another service
      </Link>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  serviceMeta.accent,
                )}
              >
                <ServiceIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-400">
                  Booking request
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-stone-950 dark:text-stone-50">
                  Book a {formatServiceType(type)}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {serviceMeta.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <BookingStepper currentStep={step} steps={["Details", "Review"]} />
          </div>

          <div className="mt-6 border-t border-stone-200 pt-6 dark:border-stone-800">
            {step === 1 ? (
              renderForm(type, handleStepOneSubmit)
            ) : (
              <div className="flex flex-col gap-4">
                <BookingReview type={type} formData={formData} />

                {isError ? (
                  <Alert variant="error" title="Couldn't create booking">
                    {error?.message ?? "Please try again."}
                  </Alert>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => setStep(1)}
                    disabled={isPending}
                    className="sm:w-32"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleConfirm}
                    loading={isPending}
                  >
                    Confirm booking
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-900/50">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            Request summary
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-semibold text-stone-950 dark:text-stone-50">
                {serviceMeta.label}
              </p>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {serviceMeta.detail}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 dark:bg-stone-950/60">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                Pricing
              </p>
              <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
                {serviceMeta.eta}. You can pay from the booking detail page
                once a payable total is available.
              </p>
            </div>
            <div className="space-y-3">
              {BOOKING_FLOW_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-amber-700 dark:bg-stone-950 dark:text-amber-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                        {point.title}
                      </p>
                      <p className="text-xs leading-5 text-stone-500 dark:text-stone-400">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Saved bookings appear in your dashboard immediately.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
