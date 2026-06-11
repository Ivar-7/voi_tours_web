import { CreditCard, Landmark, Smartphone } from "lucide-react";
import { getAvailableProviders } from "../services/payment.service";

const METHOD_META = {
  mpesa: {
    label: "M-Pesa",
    description: "Pay instantly from a Safaricom line.",
    icon: Smartphone,
  },
  stripe: {
    label: "Card",
    description: "Pay securely with Visa or Mastercard.",
    icon: CreditCard,
  },
  bank_transfer: {
    label: "Bank transfer",
    description: "Use manual transfer details from support.",
    icon: Landmark,
  },
};

export default function PaymentMethodSelector({
  currency,
  value,
  onChange,
  className = "",
}) {
  const availableProviders = getAvailableProviders(currency);

  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`.trim()}>
      {availableProviders.map((provider) => {
        const meta = METHOD_META[provider];
        const Icon = meta.icon;
        const selected = value === provider;

        return (
          <button
            key={provider}
            type="button"
            onClick={() => onChange(provider)}
            className={[
              "flex min-h-24 flex-col gap-2 rounded-2xl border px-4 py-4 text-left transition",
              selected
                ? "border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:border-zinc-700",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{meta.label}</span>
              <Icon className="h-4 w-4 shrink-0" />
            </div>
            <p
              className={[
                "text-sm leading-5",
                selected
                  ? "text-zinc-200 dark:text-zinc-700"
                  : "text-zinc-500 dark:text-zinc-400",
              ].join(" ")}
            >
              {meta.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
