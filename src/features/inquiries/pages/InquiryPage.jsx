import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import InquiryForm from "../components/InquiryForm";
import InquirySuccessMessage from "../components/InquirySuccessMessage";

export default function InquiryPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-dvh bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Get in touch
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            Tell us about your trip
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
            Whether it's a safari, an SGR transfer, a hotel stay, an event, or
            a delivery — share a few details and our team will follow up
            with options and pricing.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/40 sm:p-8">
            {submitted ? (
              <InquirySuccessMessage />
            ) : (
              <InquiryForm onSuccess={() => setSubmitted(true)} />
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900/40">
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                Reach us directly
              </h2>
              <div className="mt-4 flex flex-col gap-3 text-sm text-stone-600 dark:text-stone-300">
                <a
                  href="mailto:info@savannacrowntours.com"
                  className="flex items-center gap-3 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  info@savannacrowntours.com
                </a>
                <a
                  href="tel:+254700000000"
                  className="flex items-center gap-3 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  +254 700 000 000
                </a>
                <span className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  Voi Town, Taita Taveta County
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
              <p className="text-sm leading-6 text-amber-900 dark:text-amber-200">
                Already have an account? Sign in and use{" "}
                <span className="font-semibold">Book a service</span> for
                instant safari pricing.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
