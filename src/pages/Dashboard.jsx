import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StatsCard from "../components/StatsCard";
import CampaignTable from "../components/CampaignTable";
import { getCampaigns, deleteCampaign, getJourneys } from "../services/api";


import {
  Plus,
  Sparkles,
  Workflow,
  Activity,
  Megaphone,
  CheckCircle2,
  FileEdit,
  Loader2,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [campaignData, journeyData] = await Promise.all([
        getCampaigns(),
        getJourneys(),
      ]);

      setCampaigns(campaignData);
      setJourneys(journeyData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  loadData();
}, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete campaign.");
    }
  };

  const total = campaigns.length;
  const published = campaigns.filter((c) => c.status === "Published").length;
  const draft = campaigns.filter((c) => c.status === "Draft").length;
  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const totalJourneys = journeys.length;

  return (
    <MainLayout>
      <div className="bg-[#F7F9F5] min-h-screen p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Monitor campaigns, AI emails and customer journeys.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-campaign")}
            className="mt-3 md:mt-0 flex items-center gap-1.5 bg-[#CCD5AE] hover:bg-[#BBC59D] px-4 h-9 rounded-lg text-xs font-medium text-gray-800 shadow-sm transition"
          >
            <Plus size={14} />
            New Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Campaigns"
            value={loading ? "—" : String(total)}
            icon={Megaphone}
            onClick={() => navigate("/campaigns")}
          />
          <StatsCard
            title="Published"
            value={loading ? "—" : String(published)}
            icon={CheckCircle2}
            onClick={() => navigate("/campaigns?status=Published")}
          />
          <StatsCard
            title="Draft"
            value={loading ? "—" : String(draft)}
            icon={FileEdit}
            onClick={() => navigate("/campaigns?status=Draft")}
          />
          <StatsCard
            title="Journeys"
            value={loading ? "—" : String(totalJourneys)}
            icon={Workflow}
            onClick={() => navigate("/journey-builder")}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Campaign Table */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-semibold text-gray-800">
                Recent Campaigns
              </h2>
              <button
                onClick={() => navigate("/campaigns")}
                className="text-xs text-gray-500 font-medium hover:text-[#6B8E23] transition"
              >
                View All
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Loading...</span>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12 text-xs text-red-600">{error}</div>
            )}

            {!loading && !error && recentCampaigns.length === 0 && (
              <div className="text-center py-12 text-xs text-gray-400">
                No campaigns yet — create your first one.
              </div>
            )}

            {!loading && !error && recentCampaigns.length > 0 && (
              <CampaignTable campaigns={recentCampaigns} onDelete={handleDelete} />
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>

              <div className="space-y-2">
                <button
                  onClick={() => navigate("/create-campaign")}
                  className="w-full flex items-center gap-2.5 bg-[#CCD5AE] hover:bg-[#BBC59D] px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-800 transition"
                >
                  <Plus size={15} />
                  Create Campaign
                </button>

                <button
                  onClick={() => navigate("/ai-email")}
                  className="w-full flex items-center gap-2.5 bg-[#E9EDC9] hover:bg-[#DFE5BE] px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-800 transition"
                >
                  <Sparkles size={15} />
                  Generate AI Email
                </button>

                <button
                  onClick={() => navigate("/journey-builder")}
                  className="w-full flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-2.5 rounded-lg text-xs font-medium text-gray-700 transition"
                >
                  <Workflow size={15} />
                  Build Journey
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={15} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Recent Activity
                </h2>
              </div>

              {loading && (
                <p className="text-xs text-gray-400">Loading...</p>
              )}

              {!loading && recentCampaigns.length === 0 && (
                <p className="text-xs text-gray-400">No recent activity yet.</p>
              )}

              {!loading && recentCampaigns.length > 0 && (
                <div className="space-y-3 text-xs">
                  {recentCampaigns.slice(0, 3).map((c) => (
                    <div key={c._id} className="border-l-2 border-gray-300 pl-3">
                      <p className="font-medium text-gray-800">{c.name}</p>
                      <span className="text-gray-500">
                        {c.status === "Published" ? "Published successfully" : "Saved as draft"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;