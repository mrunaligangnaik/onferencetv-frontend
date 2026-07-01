import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import JourneyFlow from "../components/JourneyFlow";
import ConfirmDialog from "../components/ConfirmDialog";
import { getJourneys, createJourney, deleteJourney } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Save, Trash2, Workflow, Loader2 } from "lucide-react";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition";

const labelClasses = "block text-xs font-medium text-gray-700 mb-1.5";

const emptyJourney = {
  name: "",
  trigger: "User Registered",
  action: "Send Welcome Email",
  condition: "Email Opened?",
  yesOutcome: "Send Getting Started Email",
  noOutcome: "Send Reminder Email",
};

function JourneyBuilder() {
  const { showToast } = useToast();

  const [journey, setJourney] = useState(emptyJourney);
  const [saving, setSaving] = useState(false);

  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadJourneys = async () => {
    setLoading(true);
    try {
      const data = await getJourneys();
      setJourneys(data);
    } catch (err) {
      showToast(err.message || "Failed to load journeys.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const handleChange = (field) => (e) =>
    setJourney((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!journey.name.trim()) {
      showToast("Please give this journey a name.", "error");
      return;
    }

    setSaving(true);
    try {
      const created = await createJourney(journey);
      setJourneys((prev) => [created, ...prev]);
      setJourney(emptyJourney);
      showToast("Journey saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to save journey.", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteJourney(deleteTarget._id);
      setJourneys((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      showToast("Journey deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete journey.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F9F5] p-6">

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Journey Builder
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create automated customer journeys using a simple workflow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-sm font-semibold text-gray-800 mb-5">
              Journey Configuration
            </h2>

            <div className="space-y-5">

              <div>
                <label className={labelClasses}>Journey Name</label>
                <input
                  type="text"
                  value={journey.name}
                  onChange={handleChange("name")}
                  placeholder="Welcome Series for New Users"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Trigger</label>
                <select value={journey.trigger} onChange={handleChange("trigger")} className={inputClasses}>
                  <option>User Registered</option>
                  <option>Subscription Purchased</option>
                  <option>Webinar Registered</option>
                  <option>Video Completed</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Action</label>
                <select value={journey.action} onChange={handleChange("action")} className={inputClasses}>
                  <option>Send Welcome Email</option>
                  <option>Send SMS Notification</option>
                  <option>Add to CRM List</option>
                  <option>Assign to Sales Rep</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Condition</label>
                <select value={journey.condition} onChange={handleChange("condition")} className={inputClasses}>
                  <option>Email Opened?</option>
                  <option>Link Clicked?</option>
                  <option>Purchase Made?</option>
                  <option>Form Submitted?</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>If Yes</label>
                <select value={journey.yesOutcome} onChange={handleChange("yesOutcome")} className={inputClasses}>
                  <option>Send Getting Started Email</option>
                  <option>Send Discount Offer</option>
                  <option>Assign to Sales Team</option>
                  <option>Add to VIP Segment</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>If No</label>
                <select value={journey.noOutcome} onChange={handleChange("noOutcome")} className={inputClasses}>
                  <option>Send Reminder Email</option>
                  <option>Send Re-engagement Offer</option>
                  <option>Mark as Inactive</option>
                  <option>Notify Marketing Team</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-[#CCD5AE] hover:bg-[#BBC59D] disabled:opacity-60 transition rounded-lg py-2.5 text-sm font-medium text-gray-800"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving..." : "Save Journey"}
              </button>

            </div>

          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6">
              Workflow Preview
            </h2>
            <JourneyFlow journey={journey} />
          </div>

        </div>

        {/* Saved Journeys */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Workflow size={15} className="text-gray-600" />
            <h2 className="text-sm font-semibold text-gray-800">
              Saved Journeys
            </h2>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Loading journeys...</span>
            </div>
          )}

          {!loading && journeys.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-10">
              No journeys saved yet. Configure one above and click Save.
            </p>
          )}

          {!loading && journeys.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {journeys.map((j) => (
                <div key={j._id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-gray-800 truncate pr-2">{j.name}</p>
                    <button
                      onClick={() => setDeleteTarget(j)}
                      className="text-gray-400 hover:text-red-600 transition shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <JourneyFlow journey={j} compact />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this journey?"
        message={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </MainLayout>
  );
}

export default JourneyBuilder;