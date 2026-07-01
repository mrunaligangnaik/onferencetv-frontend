import { ArrowUpRight } from "lucide-react";

function StatsCard({ title, value, trend, icon: Icon, onClick }) {
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick()
          : undefined
      }
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-4 ${
        isClickable ? "cursor-pointer hover:border-gray-200 hover:shadow transition" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
          <Icon size={17} className="text-gray-600" strokeWidth={2} />
        </div>

        {trend && (
          <span className="flex items-center gap-0.5 text-[11px] font-medium text-gray-500">
            <ArrowUpRight size={11} />
            {trend}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800 mt-0.5">{value}</p>
      <p className="text-[11px] text-gray-400 mt-1">Compared to last month</p>
    </div>
  );
}

export default StatsCard;