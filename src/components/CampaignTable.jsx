import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const defaultCampaigns = [
  { _id: "1", name: "Women's Health CME Webinar", audience: "OBGYN Doctors", status: "Published" },
  { _id: "2", name: "Diabetes Awareness Campaign", audience: "General Physicians", status: "Draft" },
  { _id: "3", name: "Heart Care Webinar", audience: "Cardiologists", status: "Published" },
];

function StatusBadge({ status }) {
  const isPublished = status === "Published";
  return (
    <span
      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
        isPublished
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function CampaignTable({ campaigns = defaultCampaigns, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (campaign) => {
    if (onEdit) {
      onEdit(campaign);
    } else {
      navigate(`/create-campaign?id=${campaign._id}`);
    }
  };

  const handleDelete = (campaign) => {
    // Passes the full campaign to the parent, which opens the
    // ConfirmDialog modal (same pattern as JourneyBuilder.jsx).
    if (onDelete) {
      onDelete(campaign);
    } else {
      console.warn("CampaignTable: no onDelete handler passed — wire this to your API call.");
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-500">No campaigns yet.</p>
        <button
          onClick={() => navigate("/create-campaign")}
          className="mt-3 text-xs font-medium text-[#6B8E23] hover:underline"
        >
          Create your first campaign
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Campaign</th>
            <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Audience</th>
            <th className="text-left text-xs font-semibold text-gray-500 pb-3 pr-4">Status</th>
            <th className="text-left text-xs font-semibold text-gray-500 pb-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map((campaign, i) => (
            <tr
              key={campaign._id}
              className={i !== campaigns.length - 1 ? "border-b border-gray-50" : ""}
            >
              <td className="py-3.5 pr-4 font-medium text-gray-800">
                {campaign.name}
              </td>
              <td className="py-3.5 pr-4 text-gray-600">
                {campaign.audience}
              </td>
              <td className="py-3.5 pr-4">
                <StatusBadge status={campaign.status} />
              </td>
              <td className="py-3.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(campaign)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600 transition"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CampaignTable;