import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatDate } from "@shared/utils";

/**
 * Daily KES revenue (PayHero/M-Pesa is the only payment method, so this is
 * a single-currency series).
 *
 * @param {{ data: { date: string, amount: number }[], isLoading?: boolean }} props
 */
export default function RevenueChart({ data = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
        Loading revenue…
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-stone-200 bg-white text-sm text-stone-500 shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
        No confirmed payments in this period yet.
      </div>
    );
  }

  return (
    <div className="h-64 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#292524"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatDate(value)}
            stroke="#78716c"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#78716c"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value)}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: "#1c1917",
              border: "1px solid #292524",
              borderRadius: 12,
              color: "#fafaf9",
            }}
            labelFormatter={(value) => formatDate(value)}
            formatter={(value) => [formatCurrency(value), "Revenue"]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
