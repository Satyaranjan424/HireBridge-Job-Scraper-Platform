import { useEffect, useState } from "react";
import HiringManagerLayout from "../../layouts/HiringManagerLayout";
import { listMyJobs } from "../../api/jobApi";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../routes/router";
import { BarChart, DonutChart } from "../../components/ui/SimpleChart";

import {
  BriefcaseBusiness,
  CircleCheckBig,
  Lock,
  FileText,
  Plus,
} from "lucide-react";

export default function ManagerDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    listMyJobs()
      .then((data) => {
        setJobs(data.jobs ?? []);
      })
      .catch(() => {});
  }, []);

  const open = jobs.filter(
    (job) => job.status === "OPEN"
  ).length;

  const applicants = jobs.reduce(
    (sum, job) => sum + (job.applicantCount ?? 0),
    0
  );

  const pipelineData = jobs
    .slice(0, 5)
    .map((job) => ({
      label: job.title,
      value: job.applicantCount ?? 0,
    }));

  const statusData = [
    {
      label: "Open",
      value: open,
      tone: "open",
    },
    {
      label: "Closed",
      value: jobs.length - open,
      tone: "closed",
    },
  ];

  const metrics = [
    {
      label: "Total Jobs",
      value: jobs.length,
      caption: "All Positions",
      icon: BriefcaseBusiness,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      label: "Active Jobs",
      value: open,
      caption: "Currently Hiring",
      icon: CircleCheckBig,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Closed Jobs",
      value: jobs.length - open,
      caption: "No Longer Active",
      icon: Lock,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      label: "Applications",
      value: applicants,
      caption: "Total Applications",
      icon: FileText,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  return (
    <HiringManagerLayout
      active="dashboard"
      title="Dashboard"
    >
      {/* Welcome Banner */}

      <section className="relative mb-4 min-h-[226px] overflow-hidden rounded-xl border border-[#20314d] bg-[#122039] px-7 py-9 text-white shadow-[0_18px_36px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(15,23,42,0.22)] lg:px-9">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
         <div className="pointer-events-none absolute -right-28 top-10 h-[380px] w-[680px] rotate-[-22deg] rounded-[55%] border border-white/[0.025] bg-white/[0.025]" />
         <div className="relative z-10 flex min-h-[170px] items-center justify-between gap-10 max-lg:grid">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#F6B545]">
               Welcome Back👋
            </p>
            <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              {user.name || user.companyName}
            </h1>
            <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-slate-400">
              Manage your recruitment process,
              monitor applications and discover
              top talent from one modern dashboard.
            </p>
          </div>
          <button
            onClick={() =>
              navigate("/manager/my-jobs")
            }
            className="flex h-12 items-center gap-2 rounded-xl bg-[#F6B545] px-6 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8AA2D] hover:shadow-xl"
          >
            <Plus size={18} />
            Create Job
          </button>
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
          title="Applicants per Job"
          subtitle="Distribution of applicants across your active job postings."
          data={
            pipelineData.length
              ? pipelineData
              : [
                  {
                    label: "No Applicants",
                    value: 0,
                  },
                ]
          }
          actionLabel="View All Jobs"
          onAction={() => navigate("/manager/my-jobs")}
        />

        <DonutChart
          title="Job Status"
          subtitle="Overview of open and closed job positions."
          data={statusData}
          actionLabel="Manage Jobs"
          onAction={() => navigate("/manager/my-jobs")}
        />
      </div>
    </HiringManagerLayout>
  );
}