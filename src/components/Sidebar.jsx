import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Megaphone,
  SquarePen,
  Sparkles,
  Workflow,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Campaigns", path: "/campaigns", icon: Megaphone },
  { name: "Create Campaign", path: "/create-campaign", icon: SquarePen },
  { name: "AI Generator", path: "/ai-email", icon: Sparkles },
  { name: "Journey Builder", path: "/journey-builder", icon: Workflow },
  { name: "Settings", path: "/settings", icon: Settings },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-100 flex flex-col overflow-y-auto">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-[#6B8E23]">
          OnferenceTV
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Marketing Campaign Builder
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.path} to={item.path}>
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[#E9EDC9] text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.2 : 2} />
                    <span>{item.name}</span>
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="p-4">
        <div className="rounded-xl bg-[#F4F7ED] border border-[#E2E8D5] p-4">
          <Sparkles size={18} className="text-[#6B8E23]" />

          <h3 className="text-sm font-semibold text-gray-800 mt-2.5">
            AI Assistant
          </h3>

          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Generate smart email campaigns with Gemini AI in one click.
          </p>

          <button
            onClick={() => navigate("/ai-email")}
            className="mt-3.5 w-full bg-white border border-gray-200 rounded-lg py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-[#CCD5AE] transition"
          >
            Explore AI
          </button>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;