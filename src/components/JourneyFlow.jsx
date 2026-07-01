import { ArrowDown, Check, X } from "lucide-react";

/**
 * JourneyFlow
 *
 * Renders a single journey as a visual trigger → action → condition → outcomes diagram.
 * Used both for the live preview while building, and for each saved journey in the list.
 *
 * Props:
 * - journey: { trigger, action, condition, yesOutcome, noOutcome }
 * - compact: if true, renders smaller text/padding — used in the saved list
 */
function JourneyFlow({ journey, compact = false }) {
  if (!journey) return null;

  const boxPadding = compact ? "px-4 py-2.5" : "px-5 py-3";
  const textSize = compact ? "text-xs" : "text-sm";

  return (
    <div className="flex flex-col items-center space-y-2">

      <div className={`bg-[#CCD5AE] ${boxPadding} rounded-lg w-full max-w-xs text-center ${textSize} font-medium text-gray-800`}>
        {journey.trigger}
      </div>

      <ArrowDown size={compact ? 12 : 14} className="text-gray-400" />

      <div className={`bg-[#E9EDC9] ${boxPadding} rounded-lg w-full max-w-xs text-center ${textSize} text-gray-800`}>
        {journey.action}
      </div>

      <ArrowDown size={compact ? 12 : 14} className="text-gray-400" />

      <div className={`bg-gray-50 border border-gray-200 ${boxPadding} rounded-lg w-full max-w-xs text-center ${textSize} text-gray-700`}>
        {journey.condition}
      </div>

      <ArrowDown size={compact ? 12 : 14} className="text-gray-400" />

      <div className="flex gap-3 w-full max-w-xs">

        <div className="flex-1 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-[11px] font-medium mb-1">
            <Check size={11} />
            Yes
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">{journey.yesOutcome}</p>
        </div>

        <div className="flex-1 bg-red-50 border border-red-100 p-2.5 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-red-600 text-[11px] font-medium mb-1">
            <X size={11} />
            No
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">{journey.noOutcome}</p>
        </div>

      </div>

    </div>
  );
}

export default JourneyFlow;