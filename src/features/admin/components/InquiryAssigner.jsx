import toast from "react-hot-toast";
import { useAgents, useAssignInquiry } from "../hooks/useAdminInquiries";

/**
 * @param {{ inquiryId: string, currentAgentId: string|null }} props
 */
export default function InquiryAssigner({ inquiryId, currentAgentId }) {
  const { data: agents = [] } = useAgents();
  const { mutate, isPending } = useAssignInquiry();

  function handleChange(event) {
    const agentId = event.target.value;
    mutate(
      { id: inquiryId, agentId: agentId || null },
      {
        onSuccess: () => toast.success("Inquiry assigned"),
        onError: (err) => toast.error(err?.message || "Assignment failed"),
      },
    );
  }

  return (
    <select
      value={currentAgentId || ""}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-amber-500 disabled:opacity-60 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
    >
      <option value="">Unassigned</option>
      {agents.map((agent) => (
        <option key={agent.id} value={agent.id}>
          {agent.full_name || agent.email}
        </option>
      ))}
    </select>
  );
}
