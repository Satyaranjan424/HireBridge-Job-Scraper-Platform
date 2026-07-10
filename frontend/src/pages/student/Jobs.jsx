/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import JobCard from "../../components/jobs/JobCard";
import EmptyState from "../../components/common/EmptyState";
import Toast from "../../components/ui/Toast";

import {
  applyToJob,
  listApplications,
  listBookmarks,
  listJobs,
  saveBookmark,
  searchExternalJobs,
} from "../../api/jobApi";

import { normalizeExternalJob } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

import {
  Search,
  ExternalLink,
} from "lucide-react";

export default function StudentJobs() {
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    source: "ALL",
    experience: "",
    employmentType: "",
    salary: "",
    sort: "Newest",
    page: 1,
    limit: 8,
  });

  const [jobs, setJobs] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(next = filters) {
    setLoading(true);

    try {
      const data =
        next.source === "ALL" &&
        (next.keyword || next.location)
          ? await searchExternalJobs(next)
          : await listJobs(next);

      setJobs(data.jobs ?? []);
      setPlatforms(data.platforms ?? []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function apply(job) {
    try {
      const payload =
        job.source === "INTERNAL" && job.id
          ? {
              jobId: job.id,
              resumeUrl: user.resumeUrl,
              coverLetter: `I am interested in ${job.title}.`,
            }
          : {
              ...normalizeExternalJob(job),
              resumeUrl: user.resumeUrl,
            };

      await applyToJob(payload);
      await listApplications();

      setMessage("Application submitted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function bookmark(job) {
    try {
      const payload =
        job.source === "INTERNAL" && job.id
          ? {
              jobId: job.id,
              ...job,
            }
          : normalizeExternalJob(job);

      await saveBookmark(payload);
      await listBookmarks();

      setMessage("Job bookmarked successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-all duration-300 focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20";

  return (
    <StudentLayout active="jobs" title="Jobs">
      <Toast
        message={message}
        onClose={() => setMessage("")}
      />

      {/* Search Banner */}
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#20314d] bg-[#122039] px-8 py-8 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-16 -top-20 h-[320px] w-[650px] rotate-[-18deg] rounded-[55%] bg-white/[0.03]" />

        <div className="relative z-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#F6B545]">
            Explore Opportunities
          </p>

          <h1 className="text-4xl font-bold">
            Find Your Dream Job
          </h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            Search thousands of opportunities from HireBridge and
            external platforms in one place.
          </p>
        </div>
      </section>

            {/* Search & Filters */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          load({
            ...filters,
            page: 1,
          });
        }}
        className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            className={inputClass}
            placeholder="Job title or keyword"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({
                ...filters,
                keyword: e.target.value,
              })
            }
          />

          <input
            className={inputClass}
            placeholder="Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value,
              })
            }
          />

          <select
            className={inputClass}
            value={filters.source}
            onChange={(e) =>
              setFilters({
                ...filters,
                source: e.target.value,
              })
            }
          >
            <option value="ALL">All Sources</option>
            <option value="INTERNAL">HireBridge</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="NAUKRI">Naukri</option>
            <option value="INTERNSHALA">Internshala</option>
            <option value="UNSTOP">Unstop</option>
          </select>

          <input
            className={inputClass}
            placeholder="Experience"
            value={filters.experience}
            onChange={(e) =>
              setFilters({
                ...filters,
                experience: e.target.value,
              })
            }
          />

          <select
            className={inputClass}
            value={filters.employmentType}
            onChange={(e) =>
              setFilters({
                ...filters,
                employmentType: e.target.value,
              })
            }
          >
            <option value="">Employment Type</option>
            <option>Full-time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Part-time</option>
            <option>Remote</option>
          </select>

          <input
            className={inputClass}
            placeholder="Salary"
            value={filters.salary}
            onChange={(e) =>
              setFilters({
                ...filters,
                salary: e.target.value,
              })
            }
          />

          <select
            className={inputClass}
            value={filters.sort}
            onChange={(e) =>
              setFilters({
                ...filters,
                sort: e.target.value,
              })
            }
          >
            <option>Newest</option>
            <option>Salary</option>
            <option>Company</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F6B545] font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-[#E7A92E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Search size={18} />

            {loading ? "Searching..." : "Search Jobs"}
          </button>
        </div>
      </form>

      {/* Jobs Grid */}
      {jobs.length ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id || job.externalKey}
              job={job}
              onApply={apply}
              onBookmark={bookmark}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Jobs Found"
          text="Try changing your search filters or browse all available jobs."
        />
      )}

      {/* Source Platforms */}
      {platforms.length > 0 && (
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Source Platforms
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Continue browsing jobs directly on the original platforms.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {platforms.map((platform) => (
              <a
                key={platform.platform}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 font-medium text-slate-700 transition-all duration-300 hover:border-[#F6B545] hover:bg-amber-50 hover:text-black"
              >
                <ExternalLink size={18} />
                {platform.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </StudentLayout>
  );
}