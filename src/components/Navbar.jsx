import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { logoutUser } from "../services/api";
import { useUser } from "../context/UserContext";

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const { user } = useUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/campaigns?search=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleSettings = () => {
    setMenuOpen(false);
    navigate("/settings");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-50">

      {/* Left */}
      <div>
        <h1 className="text-sm font-semibold text-gray-800">
          Marketing Campaign Builder
        </h1>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Create, manage and automate marketing campaigns.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">

        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden lg:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns..."
            className="w-56 h-9 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-[#CCD5AE] focus:bg-white transition"
          />
        </form>

        {/* Profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
            <div className="h-6 w-6 rounded-full bg-[#E9EDC9] flex items-center justify-center">
              <User size={13} className="text-[#6B8E23]" />
            </div>
            <span className="text-xs font-medium text-gray-700 max-w-25 truncate">
              {user?.name || "Account"}
            </span>
            <ChevronDown size={13} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-gray-50">
                <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-gray-600 hover:bg-gray-50 transition"
              >
                <Settings size={13} />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}

export default Navbar;