import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import CampaignForm from "../components/CampaignForm";
import { createCampaign, updateCampaign, getCampaignById } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Loader2 } from "lucide-react";

function CreateCampaign() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");
  const { showToast } = useToast();

  const [initialData, setInitialData] = useState(undefined);
  const [loading, setLoading] = useState(Boolean(editingId));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!editingId) {
      setInitialData(undefined);
      setLoading(false);
      return;
    }

    const loadCampaign = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const data = await getCampaignById(editingId);
        setInitialData(data);
      } catch (err) {
        setLoadError(err.message || "Failed to load campaign.");
        showToast(err.message || "Failed to load campaign.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [editingId]);

  const handleSubmit = async (formData) => {
    try {
      if (editingId) {
        await updateCampaign(editingId, formData);
        showToast("Campaign updated successfully", "success");
      } else {
        await createCampaign(formData);
        showToast("Campaign created successfully", "success");
      }
      navigate("/campaigns");
    } catch (err) {
      console.error("Failed to save campaign:", err);
      showToast(err.message || "Something went wrong saving the campaign.", "error");
    }
  };

  const handleCancel = () => navigate("/campaigns");

  const handleGenerateWithAI = (formData) => {
    navigate("/ai-email", { state: formData });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F9F5] p-6">

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            {editingId ? "Edit Campaign" : "Create Campaign"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {editingId
              ? "Update this campaign's details and email content."
              : "Create a new marketing campaign and generate email content using AI."}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading campaign...</span>
            </div>
          )}

          {!loading && loadError && (
            <div className="text-center py-16 text-sm text-red-600">{loadError}</div>
          )}

          {!loading && !loadError && (
            <CampaignForm
              key={editingId || "new"}
              initialData={initialData}
              isEditing={Boolean(editingId)}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onGenerateWithAI={handleGenerateWithAI}
            />
          )}
        </div>

      </div>
    </MainLayout>
  );
}

export default CreateCampaign;