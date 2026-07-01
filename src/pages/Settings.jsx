import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { LogOut, KeyRound, User, ChevronDown, Pencil, X, Loader2 } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useToast } from "../context/ToastContext";
import { updateProfile, updatePassword } from "../services/api";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed";

function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    // revert any unsaved changes back to the current user values
    setProfile({ name: user?.name || "", email: user?.email || "" });
    setPasswords({ current: "", new: "", confirm: "" });
    setShowPasswordFields(false);
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      showToast("Name and email are required.", "error");
      return;
    }

    if (showPasswordFields) {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
        showToast("Please fill in all password fields.", "error");
        return;
      }
      if (passwords.new !== passwords.confirm) {
        showToast("New passwords do not match.", "error");
        return;
      }
      if (passwords.new.length < 6) {
        showToast("New password must be at least 6 characters.", "error");
        return;
      }
    }

    setSaving(true);
    try {
      // Update name/email in MongoDB via backend
      const updatedUser = await updateProfile({
        name: profile.name,
        email: profile.email,
      });

      // Update password in MongoDB via backend, if requested
      if (showPasswordFields) {
        await updatePassword({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
      }

      // reflects instantly in Navbar / rest of app
      updateUser(updatedUser || profile);

      showToast("Profile updated successfully.", "success");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordFields(false);
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // TODO: clear auth token / session here
    navigate("/login");
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F9F5] p-6">

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your account and application preferences.
          </p>
        </div>

        <div className="max-w-xl">

          {/* Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <User size={15} className="text-gray-600" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Profile
                </h2>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#6B8E23] transition"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleUpdate}>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className={inputClasses}
                disabled={!isEditing}
              />

              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="Email address"
                className={inputClasses}
                disabled={!isEditing}
              />

              {/* Change Password toggle */}
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowPasswordFields((prev) => !prev)}
                  disabled={!isEditing}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:cursor-not-allowed disabled:hover:bg-white disabled:text-gray-400"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound size={14} className="text-gray-500" />
                    Change Password
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      showPasswordFields ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showPasswordFields && (
                  <div className="px-3.5 pb-3.5 pt-1 space-y-3 border-t border-gray-100">
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, current: e.target.value }))
                      }
                      placeholder="Current password"
                      className={inputClasses}
                      disabled={!isEditing}
                    />
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, new: e.target.value }))
                      }
                      placeholder="New password"
                      className={inputClasses}
                      disabled={!isEditing}
                    />
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                      placeholder="Confirm new password"
                      className={inputClasses}
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 bg-[#CCD5AE] hover:bg-[#BBC59D] disabled:opacity-60 transition px-4 py-2.5 rounded-lg text-sm font-medium text-gray-800"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 disabled:opacity-60 transition px-4 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              )}
            </form>

            <hr className="my-6 border-gray-100" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
            >
              <LogOut size={14} />
              Logout
            </button>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Settings;