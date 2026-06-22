import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
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

export default function BookingPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);

  const { mutate, isPending, isError, error } = useCreateBooking();

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
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-2xl font-bold text-text-primary">
        Book a {formatServiceType(type)}
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Tell us what you need and we'll take care of the rest.
      </p>

      <div className="mt-6">
        <BookingStepper currentStep={step} />
      </div>

      <div className="mt-8">
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

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={isPending}
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
  );
}
