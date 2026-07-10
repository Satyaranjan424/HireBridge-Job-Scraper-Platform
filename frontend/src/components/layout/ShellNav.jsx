import {
  LayoutGrid,
  BriefcaseBusiness,
  Users,
  User,
  Bookmark,
  FileText,
  LogOut,
} from "lucide-react";
import { navigate } from "../../routes/router";

const iconMap = {
  grid: LayoutGrid,
  briefcase: BriefcaseBusiness,
  users: Users,
  user: User,
  save: Bookmark,
  list: FileText,
};

export default function ShellNav({
  user,
  active,
  nav,
  onLogout,
  open,
  onClose,
}) {
  const isManager = user.role === "HIRING_MANAGER";

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col bg-[#0F172A] px-6 py-8 text-white shadow-2xl transition-transform duration-300 lg:sticky lg:translate-x-0 lg:h-screen ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="mb-10 flex items-center gap-3 border-0 bg-transparent p-0"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full">
            <span className="h-3 w-3 rounded-full bg-[#F6B545] ring-[5px] ring-[#2B3548]" />
          </span>

          <h1 className="text-[20px] font-bold tracking-tight">
            HireBridge
          </h1>
        </button>

        {/* Profile Card */}
        <div className="mb-10 rounded-2xl border border-[#2B3548] bg-[#131D31] p-3">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F6B545] text-xl font-bold text-black">
              {user.name?.charAt(0) || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold uppercase">
                {isManager ? "Hiring Manager" : "Student"}
              </p>

              <p className="truncate text-[13px] text-slate-400">
                {isManager
                  ? user.companyName || user.name
                  : user.headline || "Job Seeker"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {nav.map((item) => {
            const Icon = iconMap[item.icon] || LayoutGrid;
            const selected = active === item.key;

            return (
              <button
                key={item.key}
                onClick={() => {
                  navigate(item.path);
                  onClose?.();
                }}
                className={`group relative flex h-[50px] w-full items-center gap-4 rounded-xl px-5 text-[15px] font-medium transition-all duration-200 ${
                  selected
                    ? "bg-[#1F293D] text-white"
                    : "text-slate-300 hover:bg-[#1A2335] hover:text-white"
                }`}
              >
                {selected && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-[#F6B545]" />
                )}

                <Icon size={20} strokeWidth={2} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="mt-auto flex h-[50px] w-full items-center justify-center gap-3 rounded-2xl border border-[#2B3548] text-[15px] text-slate-300 transition hover:border-[#F6B545] hover:bg-[#1A2335] hover:text-white"
        >
          <LogOut size={21} />
          Logout
        </button>
      </aside>
    </>
  );
}