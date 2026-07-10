import { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  Menu,
  Search,
  Bell,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";

export default function Topbar({
  title,
  user,
  onMenu,
  onLogout,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  const toolsRef = useRef(null);

  const initial = user.name?.charAt(0) || "U";

  useEffect(() => {
    function closeMenus(event) {
      if (
        toolsRef.current &&
        !toolsRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
        setNoticeOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNoticeOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenus);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenus);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-[90px] items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Left */}

      <div className="flex items-center gap-5">

        <button
          onClick={onMenu}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <LayoutGrid
          size={24}
          className="hidden text-[#1E293B] lg:block"
        />

        <div>
          <h2 className="text-[16px] font-semibold uppercase tracking-wide text-[#1E293B]">
            {user.role === "HIRING_MANAGER"
              ? "Recruiting Workspace"
              : "Student Workspace"}
          </h2>

          <span className="sr-only">{title}</span>
        </div>
      </div>

      {/* Right */}

      <div
        ref={toolsRef}
        className="flex items-center gap-6"
      >
        {/* Search */}

        <div className="hidden h-[45px] w-[270px] items-center rounded-xl border border-slate-200 bg-white px-5 shadow-sm transition-all focus-within:border-[#F6B545] md:flex xl:w-[320px]">

          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
          />

          <Search
            size={20}
            className="text-slate-500"
          />
        </div>

        {/* Notification */}

        <div className="relative">
          <button
            onClick={() => {
              setNoticeOpen(!noticeOpen);
              setProfileOpen(false);
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl hover:bg-slate-100"
          >
            <Bell
              size={22}
              className="text-[#1E293B]"
            />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#F6B545]" />
          </button>

          {noticeOpen && (
            <div className="absolute right-0 mt-4 w-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
              <h3 className="mb-2 font-semibold">
                Notifications
              </h3>

              <p className="text-sm text-slate-500">
                No new notifications.
              </p>
            </div>
          )}
        </div>

        {/* Profile */}

        <div className="relative">

          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNoticeOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#F6B545] text-lg font-bold text-black"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              initial
            )}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-4 w-[320px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">

              <div className="mb-5 flex items-center gap-4">

                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6B545] font-bold text-black">
                    {initial}
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="truncate font-semibold">
                    {user.name}
                  </h4>

                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>

              </div>

              <button className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-100">
                <Settings size={18} />
                Settings
              </button>

              <button className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-100">
                <Shield size={18} />
                Privacy Policy
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}