import { AlertTriangle } from "lucide-react";

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-9999 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={17} className="text-red-500" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>

        <p className="text-xs text-gray-500 mb-6">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;