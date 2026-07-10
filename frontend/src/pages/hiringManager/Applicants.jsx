import { useEffect, useState } from "react";
import HiringManagerLayout from "../../layouts/HiringManagerLayout";
import EmptyState from "../../components/common/EmptyState";

import {
  listApplicants,
  listMyJobs,
} from "../../api/jobApi";

import { asList } from "../../utils/format";

import {
  Users,
  BriefcaseBusiness,
  CircleCheckBig,
  Clock3,
  XCircle,
  Check,
  X,
  Clock,
  FileText,
} from "lucide-react";

export default function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState("");
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    listMyJobs()
      .then((data) => {
        const nextJobs = data.jobs ?? [];
        setJobs(nextJobs);

        if (nextJobs.length) {
          selectJob(nextJobs[0].id);
        }
      })
      .catch(() => {});
  }, []);

  async function selectJob(id) {
    setSelected(id);

    const data = await listApplicants(id);
    setApplicants(data.applicants ?? []);
  }

  const shortlisted = applicants.filter(
    (item) => item.status === "SHORTLISTED"
  ).length;

  const pending = applicants.filter(
    (item) => item.status === "PENDING"
  ).length;

  const rejected = applicants.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20";

  const stats = [
    {
      title: "Applicants",
      value: applicants.length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      icon: CircleCheckBig,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <HiringManagerLayout
      active="applicants"
      title="Applicants"
    >
      {/* Statistics */}
      <div className="mb-8 grid gap-6 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon
                  size={26}
                  className={item.color}
                />
              </div>

              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {item.value}
              </h2>
            </article>
          );
        })}
      </div>

      {/* Job Selector */}
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <BriefcaseBusiness
              size={24}
              className="text-amber-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Select Job
            </h2>

            <p className="text-sm text-slate-500">
              View applicants for a specific job posting.
            </p>
          </div>
        </div>

        <select
          className={`${inputClass} w-full`}
          value={selected}
          onChange={(e) => selectJob(e.target.value)}
        >
          {jobs.map((job) => (
            <option
              key={job.id}
              value={job.id}
            >
              {job.title}
            </option>
          ))}
        </select>
      </section>

      {applicants.length ? (
        <div className="space-y-5">
          {applicants.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                      <Users
                        size={26}
                        className="text-slate-700"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {item.student.name}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {item.student.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {asList(item.student.skills)
                      .slice(0, 5)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                    <span>
                      Applied on{" "}
                      {new Date(
                        item.appliedAt
                      ).toLocaleDateString()}
                    </span>
                                        {item.student.resumeUrl ? (
                      <a
                        href={item.student.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <FileText size={17} />
                        View Resume
                      </a>
                    ) : (
                      <span className="text-slate-400">
                        Resume not uploaded
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <span
                    className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                      item.status === "SHORTLISTED"
                        ? "bg-green-100 text-green-700"
                        : item.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="flex h-11 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 font-medium text-green-700 transition hover:bg-green-100"
                    >
                      <Check size={17} />
                      Shortlist
                    </button>

                    <button
                      type="button"
                      className="flex h-11 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 font-medium text-red-700 transition hover:bg-red-100"
                    >
                      <X size={17} />
                      Reject
                    </button>

                    <button
                      type="button"
                      className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <Clock size={17} />
                      Later
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applicants yet"
          text="Applicants will appear here after students apply to this job."
        />
      )}
    </HiringManagerLayout>
  );
}