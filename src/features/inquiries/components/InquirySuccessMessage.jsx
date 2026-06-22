import { CheckCircle2, MessageCircle } from "lucide-react";
import Button from "@shared/components/ui/Button";

const WHATSAPP_NUMBER = "254700000000";

export default function InquirySuccessMessage() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-status-completed/30 bg-status-completed/10 p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-completed/15 text-status-completed">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">
          We've got your inquiry
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          Our team will get back to you by email or phone within one business
          day.
        </p>
      </div>
      <Button
        as="a"
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        variant="secondary"
      >
        <MessageCircle className="h-4 w-4" />
        Chat with us on WhatsApp
      </Button>
    </div>
  );
}
