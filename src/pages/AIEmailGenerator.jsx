import { useState } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { generateEmailWithAI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Sparkles, RefreshCw, Copy, Check, Loader2, AlertCircle, Wand2 } from "lucide-react";

const inputClasses =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:border-transparent transition";

const labelClasses = "block text-xs font-medium text-gray-700 mb-1";
const helperClasses = "text-[11px] text-gray-400 mb-1.5";

function OutputBlock({ title, content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-gray-800">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] font-medium text-[#6B8E23] hover:underline"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2.5 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

function AIEmailGenerator() {
  const location = useLocation();
  const incoming = location.state || {};
  const { showToast } = useToast();

  const [objective, setObjective] = useState(incoming.objective || "");
  const [audience, setAudience] = useState(incoming.audience || "");
  const [cta, setCta] = useState(incoming.ctaText || "");

  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canGenerate = objective.trim().length > 0 && audience.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError("Tell us what the campaign is about and who it's for — then we can generate.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await generateEmailWithAI({ objective, audience, cta });
      setOutput(result);
      showToast("Your email is ready", "success");
    } catch (err) {
      setError(err.message || "AI couldn't generate this email. Try again in a moment.");
      showToast("AI generation failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F7F9F5] p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight flex items-center gap-2">
            <Wand2 size={20} className="text-[#6B8E23]" />
            AI Email Generator
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Describe your campaign in a few words — AI will draft the subject line, preview text, email body, and CTA for you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            <h2 className="text-sm font-semibold text-gray-800 mb-1">
              Tell us about this campaign
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              The more specific you are, the better the draft.
            </p>

            <div className="space-y-5">

              <div>
                <label className={labelClasses}>What's this campaign for?</label>
                <p className={helperClasses}>Your goal — what should the reader do after opening this email?</p>
                <textarea
                  rows="4"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g. Promote an upcoming Women's Health CME Webinar for OBGYNs"
                  className={inputClasses}
                ></textarea>
              </div>

              <div>
                <label className={labelClasses}>Who's this for?</label>
                <p className={helperClasses}>AI will adjust tone and language to match this audience.</p>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
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
                <label className={labelClasses}>Call to action <span className="text-gray-400 font-normal">(optional)</span></label>
                <p className={helperClasses}>Leave blank and AI will suggest one that fits.</p>
                <input
                  type="text"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  placeholder="e.g. Register Now"
                  className={inputClasses}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#CCD5AE] hover:bg-[#BBC59D] disabled:opacity-60 disabled:cursor-not-allowed transition rounded-lg py-2.5 text-sm font-medium text-gray-800"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Writing your email...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generate Email with AI
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center -mt-1">
                Takes about 5–10 seconds. You'll be able to edit everything after.
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            <div className="flex justify-between items-center mb-1">
              <h2 className="text-sm font-semibold text-gray-800">
                AI Generated Output
              </h2>

              {output && (
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-60 transition"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  Regenerate
                </button>
              )}
            </div>
            {output && (
              <p className="text-xs text-gray-400 mb-4">
                Not quite right? Hit Regenerate for a new draft, or copy and tweak below.
              </p>
            )}

            {!output && !loading && (
              <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
                <Sparkles size={28} className="mb-3" />
                <p className="text-sm font-medium text-gray-500">Nothing generated yet</p>
                <p className="text-xs mt-1 max-w-60">
                  Fill in the campaign details on the left, then generate to see your draft here.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Loader2 size={24} className="animate-spin mb-3" />
                <p className="text-sm">Talking to Gemini...</p>
              </div>
            )}

            {output && !loading && (
              <div className="space-y-4">
                <OutputBlock title="Subject Line" content={output.subject} />
                <OutputBlock title="Preview Text" content={output.preview} />
                <OutputBlock title="Email Content" content={output.content} />
                <OutputBlock title="CTA Suggestion" content={output.cta} />
              </div>
            )}

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default AIEmailGenerator;