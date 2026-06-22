import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Textarea from "@shared/components/ui/Textarea";
import Button from "@shared/components/ui/Button";
import Alert from "@shared/components/ui/Alert";
import { ServiceType } from "@shared/types/enums";
import { formatServiceType } from "@shared/utils";
import { inquirySchema } from "../schema/inquiry.schema";
import { useSubmitInquiry } from "../hooks/useSubmitInquiry";

const SERVICE_OPTIONS = Object.values(ServiceType).map((value) => ({
  value,
  label: formatServiceType(value),
}));

/**
 * Public lead-capture form. `_hp` is a honeypot field — hidden from sighted
 * users via off-screen positioning (not `display:none`, which some bots
 * detect and skip) but still in the tab/DOM order for naive scrapers to fill.
 *
 * @param {{ onSuccess?: () => void }} props
 */
export default function InquiryForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      requested_service: "",
      message: "",
      _hp: "",
    },
  });

  const { mutate, isPending, isError, error } = useSubmitInquiry();

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => {
        reset();
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
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="_hp">Leave this field empty</label>
        <input
          id="_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("_hp")}
        />
      </div>

      <Input
        label="Full name"
        error={errors.customer_name?.message}
        {...register("customer_name")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="email"
          label="Email"
          error={errors.customer_email?.message}
          {...register("customer_email")}
        />
        <Input
          label="Phone"
          placeholder="07XXXXXXXX"
          error={errors.customer_phone?.message}
          {...register("customer_phone")}
        />
      </div>

      <Select
        label="What can we help with?"
        placeholder="Choose a service"
        options={SERVICE_OPTIONS}
        error={errors.requested_service?.message}
        {...register("requested_service")}
      />

      <Textarea
        label="Tell us more"
        rows={5}
        hint="At least 20 characters."
        error={errors.message?.message}
        {...register("message")}
      />

      {isError ? (
        <Alert variant="error" title="Couldn't send your inquiry">
          {error?.message ?? "Please try again."}
        </Alert>
      ) : null}

      <Button type="submit" loading={isPending}>
        Send inquiry
      </Button>
    </form>
  );
}
