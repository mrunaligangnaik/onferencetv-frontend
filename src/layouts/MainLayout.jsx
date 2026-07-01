import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F7F9F5]">

      {/* Sidebar: fixed height, pinned to viewport, never scrolls itself */}
      <div className="h-screen sticky top-0 shrink-0">
        <Sidebar />
      </div>

      {/* Right column: navbar stays put, only this area scrolls */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

export default MainLayout;