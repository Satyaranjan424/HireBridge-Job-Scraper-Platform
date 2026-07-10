/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import HiringManagerLayout from "../../layouts/HiringManagerLayout";
import EmptyState from "../../components/common/EmptyState";
import Toast from "../../components/ui/Toast";

import {
  closeJob,
  createJob,
  deleteJob,
  listMyJobs,
  updateJob,
} from "../../api/jobApi";

import { normalizeJobPayload, toInputList } from "../../utils/format";
import { navigate } from "../../routes/router";

import {
  BriefcaseBusiness,
  CircleCheckBig,
  Users,
  Plus,
  Search,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  Eye,
  Lock,
} from "lucide-react";

const emptyJob = {
  title: "",
  company: "",
  location: "",
  employmentType: "Full-time",
  experience: "",
  salaryRange: "",
  description: "",
  requirements: "",
  applyUrl: "",
};

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  async function load() {
    const data = await listMyJobs();
    setJobs(data.jobs ?? []);
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = normalizeJobPayload(form);

      if (form.id) {
        await updateJob(form.id, payload);
      } else {
        await createJob(payload);
      }

      setForm(emptyJob);
      await load();

      setMessage(form.id ? "Job updated successfully." : "Job posted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function close(id) {
    await closeJob(id);
    await load();
  }

  async function remove(id) {
    await deleteJob(id);
    await load();
  }

  const open = jobs.filter((job) => job.status === "OPEN").length;
  const applicants = jobs.reduce((sum, job) => sum + (job.applicantCount ?? 0), 0);

  const stats = [
    {
      title: "Open Jobs",
      value: open,
      icon: CircleCheckBig,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Closed Jobs",
      value: jobs.length - open,
      icon: Lock,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Applicants",
      value: applicants,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);

    const matchesFilter = filter === "ALL" || job.status === filter;
    return matchesSearch && matchesFilter;
  });

  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20";

  return (
    <HiringManagerLayout active="my-jobs" title="My Jobs">
      <Toast message={message} onClose={() => setMessage("")} />

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                <Icon size={26} className={item.color} />
              </div>

              <p className="text-sm font-medium text-slate-500">{item.title}</p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">{item.value}</h2>
            </article>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Create Job Form */}
        <form
          onSubmit={submit}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <BriefcaseBusiness size={24} className="text-amber-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {form.id ? "Edit Job" : "Create New Job"}
              </h2>
              <p className="text-sm text-slate-500">Fill the information below.</p>
            </div>
          </div>

          <div className="grid gap-5">
            <input
              className={inputClass}
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="relative">
              <Building2
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${inputClass} pl-11`}
                placeholder="Company Name"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>

            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClass} pl-11`}
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <select
              className={inputClass}
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>

            <input
              className={inputClass}
              placeholder="Experience Required"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="Salary Range"
              value={form.salaryRange}
              onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
            />

            <textarea
              rows={5}
              className="rounded-xl border border-slate-200 px-4 py-3 text-[15px] outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20"
              placeholder="Job Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <textarea
              rows={3}
              className="rounded-xl border border-slate-200 px-4 py-3 text-[15px] outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20"
              placeholder="Requirements (comma separated)"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            />

            <input
              className={inputClass}
              placeholder="Application URL"
              value={form.applyUrl}
              onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F6B545] font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#E7A92E] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus size={18} />
              {loading ? "Saving..." : form.id ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>

        {/* Right Section */}
        <section>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} w-full pl-11`}
                placeholder="Search jobs..."
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`${inputClass} w-full md:w-48`}
            >
              <option value="ALL">All Jobs</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {filteredJobs.length ? (
            <div className="space-y-5">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide ${
                            job.status === "OPEN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>

                        <span className="text-sm text-slate-500">
                          {job.applicantCount ?? 0} Applicants
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>

                      <div className="mt-3 flex flex-wrap items-center gap-5 text-[15px] text-slate-500">
                        <span className="flex items-center gap-2">
                          <Building2 size={17} />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={17} />
                          {job.location}
                        </span>
                      </div>

                      {job.description && (
                        <p className="mt-5 line-clamp-2 text-[15px] leading-7 text-slate-600">
                          {job.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...job,
                            requirements: toInputList(job.requirements),
                          })
                        }
                        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Pencil size={17} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate("/manager/applicants", {
                            jobId: job.id,
                          })
                        }
                        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        <Eye size={17} />
                        Applicants
                      </button>

                      <button
                        type="button"
                        onClick={() => close(job.id)}
                        className="flex h-11 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 font-medium text-amber-700 transition hover:bg-amber-100"
                      >
                        <Lock size={17} />
                        Close
                      </button>

                      <button
                        type="button"
                        onClick={() => remove(job.id)}
                        className="flex h-11 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 font-medium text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No jobs posted yet"
              text="Create your first job posting to start receiving applications."
            />
          )}
        </section>
      </div>
    </HiringManagerLayout>
  );
}

