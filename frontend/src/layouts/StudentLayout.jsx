import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ShellNav from "../components/layout/ShellNav";
import Topbar from "../components/layout/Topbar";
import { navigate, studentPath } from "../routes/router";

const nav = [
  { key: "dashboard", label: "Dashboard", path: studentPath("dashboard"), icon: "grid" },
  { key: "jobs", label: "Jobs", path: studentPath("jobs"), icon: "briefcase" },
  { key: "applications", label: "Applications", path: studentPath("applications"), icon: "list" },
  { key: "bookmarks", label: "Bookmarks", path: studentPath("bookmarks"), icon: "save" },
  { key: "profile", label: "Profile", path: studentPath("profile"), icon: "user" },
];

export default function StudentLayout({
  active,
  title,
  children,
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  async function signOut() {
    await logout();
    navigate("/");
  }

  return (
    <main className="grid min-h-screen bg-[#F8FAFC] lg:grid-cols-[300px_minmax(0,1fr)]">
      <ShellNav
        user={user}
        active={active}
        nav={nav}
        open={open}
        onClose={() => setOpen(false)}
        onLogout={signOut}
      />

      <section className="min-w-0">
        <Topbar
          title={title}
          user={user}
          onMenu={() => setOpen((v) => !v)}
          onLogout={signOut}
        />

        <div className="px-8 py-8">
          {children}
        </div>
      </section>
    </main>
  );
}