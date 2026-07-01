import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Sparkles, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await registerUser(form);
        showToast("Account created successfully", "success");
      } else {
        await loginUser({ email: form.email, password: form.password });
        showToast("Logged in successfully", "success");
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-100 p-8">

        <div className="flex items-center gap-2 mb-1">
          <div className="h-8 w-8 rounded-lg bg-[#E9EDC9] flex items-center justify-center">
            <Sparkles size={16} className="text-[#6B8E23]" />
          </div>
          <h1 className="text-lg font-semibold text-gray-800">OnferenceTV</h1>
        </div>
        <p className="text-xs text-gray-500 mb-6">
          Marketing Campaign Builder
        </p>

        <h2 className="text-sm font-semibold text-gray-800 mb-5">
          {isRegister ? "Create an account" : "Sign in to your account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange("name")}
              className={inputClasses}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange("email")}
            className={inputClasses}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange("password")}
              className={`${inputClasses} pr-10`}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#6B8E23] hover:bg-[#5A7A1D] disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium transition"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => { setIsRegister(!isRegister); setError(""); }}
          className="w-full text-center text-xs text-gray-500 mt-5 hover:text-[#6B8E23] transition"
        >
          {isRegister
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>

      </div>
    </div>
  );
}

export default Login;