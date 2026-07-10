import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import EmptyState from "../../components/common/EmptyState";

import {
  listApplications,
  listBookmarks,
  listJobs,
} from "../../api/jobApi";

import { completion } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../routes/router";

import {
  BarChart,
  DonutChart,
} from "../../components/ui/SimpleChart";

import {
  BriefcaseBusiness,
  Bookmark,
  Clock3,
  Users,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  const [data, setData] = useState({
    jobs: [],
    applications: [],
    bookmarks: [],
  });

  useEffect(() => {
    Promise.all([
      listJobs({ limit: 3 }),
      listApplications(),
      listBookmarks(),
    ])
      .then(([jobData, appData, bookmarkData]) =>
        setData({
          jobs: jobData.jobs ?? [],
          applications: appData.applications ?? [],
          bookmarks: bookmarkData.bookmarks ?? [],
        })
      )
      .catch(() => {});
  }, []);

  const reviewing = data.applications.filter(
    (item) => item.status === "REVIEWING"
  ).length;

  const shortlisted = data.applications.filter(
    (item) => item.status === "SHORTLISTED"
  ).length;

  const statusData = [
    "APPLIED",
    "REVIEWING",
    "SHORTLISTED",
    "REJECTED",
  ].map((status) => ({
    label: status,
    value: data.applications.filter(
      (item) => item.status === status
    ).length,
    tone: status.toLowerCase(),
  }));

  const activityData = [
    {
      label: "Applications",
      value: data.applications.length,
    },
    {
      label: "Bookmarks",
      value: data.bookmarks.length,
    },
    {
      label: "Recommended Jobs",
      value: data.jobs.length,
    },
  ];

  const metrics = [
    {
      label: "Applied Jobs",
      value: data.applications.length,
      caption: "Total Applications",
      icon: BriefcaseBusiness,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      label: "Saved Jobs",
      value: data.bookmarks.length,
      caption: "Bookmarked Roles",
      icon: Bookmark,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Open Applications",
      value: reviewing,
      caption: "Under Review",
      icon: Clock3,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Interview Calls",
      value: shortlisted,
      caption: "Shortlisted",
      icon: Users,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <StudentLayout
      active="dashboard"
      title="Dashboard"
    >

      {/* Welcome Banner */}
      <section className="relative mb-8 min-h-[220px] overflow-hidden rounded-3xl bg-[#132238] px-10 py-10 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-20 h-80 w-[720px] rotate-[-18deg] rounded-[55%] border border-white/5 bg-white/5" />
        <div className="pointer-events-none absolute -right-20 top-8 h-80 w-[650px] rotate-[-20deg] rounded-[55%] border border-white/5 bg-white/5" />
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#F6B545]">
              Welcome Back👋
            </p>
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              {user.name}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
              Discover new opportunities, track your
              applications and build your career from
              one powerful dashboard.
            </p>
          </div>
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner">
            <span className="text-3xl font-bold text-[#F6B545]">
              {completion(user, user.role)}%
            </span>
            <span className="mt-1 text-xs uppercase tracking-wider text-slate-300">
              Profile
            </span>
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {metrics.map((item) => {
          const MetricIcon = item.icon;
          return (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <MetricIcon
                  size={26}
                  className={item.color}
                />
              </div>
              <p className="text-sm font-medium text-slate-500">
                {item.label}
              </p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {item.value}
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                {item.caption}
              </p>
            </article>
          );

        })}

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">

        <BarChart
          title="Activity Overview"
          subtitle="Track your overall job search activity."
          data={activityData}
          actionLabel="Browse Jobs"
          onAction={() => navigate("/student/jobs")}
        />

        <DonutChart
          title="Application Status"
          subtitle="Current status of your job applications."
          data={statusData}
          actionLabel="View Applications"
          onAction={() => navigate("/student/applications")}
        />

      </div>

            {/* Recent Applications */}

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest job applications.
              </p>

            </div>

            <button
              onClick={() => navigate("/student/applications")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View All
            </button>

          </div>

          {data.applications.length ? (

            <div className="space-y-4">

              {data.applications.slice(0, 4).map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all duration-300 hover:border-[#F6B545] hover:bg-amber-50/40"
                >

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {item.company}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Applied on{" "}
                      {new Date(item.appliedAt).toLocaleDateString()}
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                      item.status === "SHORTLISTED"
                        ? "bg-green-100 text-green-700"
                        : item.status === "REVIEWING"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

              ))}

            </div>

          ) : (
                        <div className="py-6">
              <EmptyState
                title="No Applications Yet"
                text="Start applying for jobs to track your applications here."
              />
            </div>

          )}

        </section>

        {/* Recommended Jobs */}

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Recommended Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Jobs that match your profile.
              </p>

            </div>

            <button
              onClick={() => navigate("/student/jobs")}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View All
            </button>

          </div>

          {data.jobs.length ? (

            <div className="space-y-4">

              {data.jobs.map((job) => (

                <div
                  key={job.id}
                  className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#F6B545] hover:shadow-md"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex-1">

                      <h3 className="text-lg font-bold text-slate-900">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {job.company}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {job.location}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        navigate("/student/jobs")
                      }
                      className="rounded-xl bg-[#F6B545] px-4 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-[#E7A92E]"
                    >
                      Apply
                    </button>

                  </div>

                </div>

              ))}

            </div>

          ) : (
            <div className="py-6">
              <EmptyState
                title="No Recommended Jobs"
                text="We'll recommend jobs for you based on your profile."
              />
            </div>

          )}

        </section>

      </div>

    </StudentLayout>
  );
}