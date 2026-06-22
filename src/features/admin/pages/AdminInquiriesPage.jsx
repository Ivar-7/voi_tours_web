import { useState } from "react";
import Select from "@shared/components/ui/Select";
import Pagination from "@shared/components/ui/Pagination";
import { usePagination } from "@shared/hooks";
import { ServiceType } from "@shared/types/enums";
import InquiriesTable from "../components/InquiriesTable";
import { useAdminInquiries } from "../hooks/useAdminInquiries";

const PAGE_SIZE = 10;

const CONVERTED_OPTIONS = [
  { value: "", label: "All" },
  { value: "false", label: "New" },
  { value: "true", label: "Converted" },
];

const SERVICE_OPTIONS = [
  { value: "", label: "All services" },
  ...Object.values(ServiceType).map((s) => ({ value: s, label: s })),
];

export default function AdminInquiriesPage() {
  const [converted, setConverted] = useState("");
  const [service, setService] = useState("");

  const filters = {
    ...(converted ? { is_converted: converted === "true" } : {}),
    ...(service ? { requested_service: service } : {}),
  };

  const { data, isLoading, error, refetch } = useAdminInquiries(filters);
  const inquiries = data?.data ?? [];

  const { page, totalPages, goTo } = usePagination({
    totalItems: inquiries.length,
    pageSize: PAGE_SIZE,
  });
  const pageItems = inquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
          Leads
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-stone-50">
          Inquiries
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-48">
          <Select
            options={CONVERTED_OPTIONS}
            value={converted}
            onChange={(e) => setConverted(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={SERVICE_OPTIONS}
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div>
      </div>

      <InquiriesTable
        inquiries={pageItems}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={goTo} />
      ) : null}
    </div>
  );
}
