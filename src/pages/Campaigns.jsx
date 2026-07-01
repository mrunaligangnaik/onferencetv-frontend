import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CampaignTable from "../components/CampaignTable";
import ConfirmDialog from "../components/ConfirmDialog";
import { getCampaigns, deleteCampaign } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Plus, Search, Loader2 } from "lucide-react";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition";

function Campaigns() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "All Status");
  const [audience, setAudience] = useState("All Audience");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const audienceOptions = useMemo(
    () => ["All Audience", ...new Set(campaigns.map((c) => c.audience))],
    [campaigns]
  );

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All Status" || c.status === status;
    const matchesAudience = audience === "All Audience" || c.audience === audience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCampaign(deleteTarget._id);
      setCampaigns((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      showToast("Campaign deleted successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete campaign.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F9F5] p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              Campaign Management
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Create, edit and manage your marketing campaigns.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-campaign")}
            className="mt-3 md:mt-0 flex items-center gap-1.5 bg-[#CCD5AE] hover:bg-[#BBC59D] transition px-4 h-9 rounded-lg text-xs font-medium text-gray-800 shadow-sm"
          >
            <Plus size={14} />
            Create Campaign
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="grid md:grid-cols-3 gap-4">

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaign..."
                className={`${inputClasses} pl-9`}
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClasses}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>

            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className={inputClasses}
            >
              {audienceOptions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

          </div>
        </div>

        {/* Campaign Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading campaigns...</span>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16 text-sm text-red-600">{error}</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No campaigns found. Try adjusting your filters or create a new one.
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <CampaignTable campaigns={filtered} onDelete={setDeleteTarget} />
          )}
        </div>

      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this campaign?"
        message={`"${deleteTarget?.name}" will be permanently removed. This can't be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </MainLayout>
  );
}

export default Campaigns;