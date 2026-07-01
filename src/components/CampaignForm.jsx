import { useState } from "react";
import { Sparkles, Save, RotateCcw, X } from "lucide-react";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition";

const labelClasses = "block text-xs font-medium text-gray-700 mb-1.5";

export const emptyCampaign = {
  name: "",
  objective: "",
  subject: "",
  preview: "",
  content: "",
  ctaText: "",
  ctaUrl: "",
  audience: "",
  status: "Draft",
};

/**
 * CampaignForm
 *
 * Reusable campaign form — used by CreateCampaign.jsx for both
 * "create" and "edit" flows, and can be dropped into a modal elsewhere
 * without duplicating markup.
 *
 * Props:
 * - initialData: campaign object to pre-fill (defaults to emptyCampaign)
 * - isEditing: boolean — only changes button labels, no logic difference
 * - onSubmit(formData): called with the current form state on submit
 * - onCancel(): called when Cancel is clicked
 * - onGenerateWithAI(formData): called when "Generate with AI" is clicked,
 *   receives the current form so the caller can prefill the AI generator
 */
function CampaignForm({
  initialData = emptyCampaign,
  isEditing = false,
  onSubmit,
  onCancel,
  onGenerateWithAI,
}) {
  const [form, setForm] = useState({ ...emptyCampaign, ...initialData });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  const handleReset = () => setForm({ ...emptyCampaign, ...initialData });

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>

      <div>
        <label className={labelClasses}>Campaign Name</label>
        <input
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Women's Health CME Webinar"
          className={inputClasses}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Campaign Objective</label>
        <textarea
          rows="3"
          value={form.objective}
          onChange={handleChange("objective")}
          placeholder="Promote an upcoming Women's Health CME Webinar."
          className={inputClasses}
        ></textarea>
      </div>

      <div>
        <label className={labelClasses}>Subject Line</label>
        <input
          type="text"
          value={form.subject}
          onChange={handleChange("subject")}
          placeholder="Join Our Exclusive Women's Health CME Webinar"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Preview Text</label>
        <input
          type="text"
          value={form.preview}
          onChange={handleChange("preview")}
          placeholder="Learn from leading experts and earn CME credits."
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Email Content</label>
        <textarea
          rows="8"
          value={form.content}
          onChange={handleChange("content")}
          placeholder="Write your email content..."
          className={inputClasses}
        ></textarea>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>CTA Button Text</label>
          <input
            type="text"
            value={form.ctaText}
            onChange={handleChange("ctaText")}
            placeholder="Register Now"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>CTA URL</label>
          <input
            type="url"
            value={form.ctaUrl}
            onChange={handleChange("ctaUrl")}
            placeholder="https://example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelClasses}>Audience</label>
          <select
            value={form.audience}
            onChange={handleChange("audience")}
            className={inputClasses}
          >
            <option value="">Select Audience</option>
            <option>OBGYN Doctors</option>
            <option>General Physicians</option>
            <option>Cardiologists</option>
            <option>Students</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>Status</label>
          <select
            value={form.status}
            onChange={handleChange("status")}
            className={inputClasses}
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>
      </div>

      {onGenerateWithAI && (
        <div>
          <button
            type="button"
            onClick={() => onGenerateWithAI(form)}
            className="flex items-center gap-2 bg-[#E9EDC9] hover:bg-[#DFE5BE] transition px-4 py-2.5 rounded-lg text-sm font-medium text-gray-800"
          >
            <Sparkles size={15} />
            Generate with AI
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#6B8E23] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#5A7A1D] transition"
        >
          <Save size={15} />
          {isEditing ? "Update Campaign" : "Save Campaign"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            <X size={15} />
            Cancel
          </button>
        )}
      </div>

    </form>
  );
}

export default CampaignForm;