import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@shared/components/ui/Modal";
import Input from "@shared/components/ui/Input";
import Select from "@shared/components/ui/Select";
import Button from "@shared/components/ui/Button";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination } from "@shared/hooks";
import { ServiceType, OperationalStatus } from "@shared/types/enums";
import BookingsTable from "../components/BookingsTable";
import { useAdminBookings, usePriceBooking } from "../hooks/useAdminBookings";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.values(OperationalStatus).map((s) => ({ value: s, label: s })),
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  ...Object.values(ServiceType).map((t) => ({ value: t, label: t })),
];

function PriceForm({ booking, onClose }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(booking?.currency || "KES");
  const { mutate, isPending } = usePriceBooking();

  function handleSubmit(event) {
    event.preventDefault();
    const totalAmount = Number(amount);
    if (!totalAmount || totalAmount <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    mutate(
      { id: booking.id, totalAmount, currency },
      {
        onSuccess: () => {
          toast.success("Price set — booking confirmed");
          onClose();
        },
        onError: (err) => toast.error(err?.message || "Couldn't set price"),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        type="number"
        min={1}
        label="Total amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        autoFocus
      />
      <Select
        label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        options={[
          { value: "KES", label: "KES" },
          { value: "USD", label: "USD" },
        ]}
      />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Confirm booking
        </Button>
      </div>
    </form>
  );
}

export default function AdminBookingsPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [priceTarget, setPriceTarget] = useState(null);

  const filters = {
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
  };

  const { data, isLoading, error, refetch } = useAdminBookings(filters);
  const bookings = data?.data ?? [];

  const { page, totalPages, goTo } = usePagination({
    totalItems: bookings.length,
    pageSize: PAGE_SIZE,
  });
  const pageItems = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          Operations
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-900 dark:text-stone-50">
          Bookings
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={TYPE_OPTIONS}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>
      </div>

      <BookingsTable
        bookings={pageItems}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onSetPrice={setPriceTarget}
      />

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
      ) : null}

      <Modal
        isOpen={Boolean(priceTarget)}
        onClose={() => setPriceTarget(null)}
        title="Set booking price"
        size="sm"
      >
        {priceTarget ? (
          <PriceForm
            booking={priceTarget}
            onClose={() => setPriceTarget(null)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
