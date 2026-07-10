import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import EmptyState from "../../components/common/EmptyState";
import JobCard from "../../components/jobs/JobCard";
import Toast from "../../components/ui/Toast";

import {
  applyToJob,
  listBookmarks,
} from "../../api/jobApi";

import {
  normalizeExternalJob,
} from "../../utils/format";

import {
  Bookmark,
  Search,
  ArrowUpDown,
} from "lucide-react";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listBookmarks()
      .then((data) =>
        setBookmarks(data.bookmarks ?? [])
      )
      .catch((error) =>
        setMessage(error.message)
      );
  }, []);

  async function apply(job) {
    try {
      await applyToJob(
        job.jobId
          ? {
              jobId: job.jobId,
            }
          : normalizeExternalJob(job)
      );
      setMessage("Application submitted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  const inputClass =
    "h-12 rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-700 outline-none transition-all focus:border-[#F6B545] focus:ring-4 focus:ring-[#F6B545]/20";

  return (
    <StudentLayout
      active="bookmarks"
      title="Bookmarks"
    >
      <Toast
        message={message}
        onClose={() => setMessage("")}
      />

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Saved Jobs
          </h1>
          <p className="mt-2 text-slate-500">
            Quickly access your bookmarked opportunities.
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <Bookmark
            size={28}
            className="text-amber-600"
          />
        </div>
      </div>

      {/* Search & Sort */}
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className={`${inputClass} w-full pl-11`}
              placeholder="Search saved jobs..."
            />
          </div>
          <div className="relative">
            <ArrowUpDown
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              className={`${inputClass} w-full pl-11`}
            >
              <option>Newest Saved</option>
              <option>Company</option>
              <option>Location</option>
            </select>
          </div>
        </div>
      </section>

      {/* Bookmarked Jobs */}
      {bookmarks.length ? (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Your Bookmarked Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {bookmarks.length} saved {bookmarks.length === 1 ? "job" : "jobs"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {bookmarks.map((job) => (
              <div
                key={job.id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <JobCard
                  job={job}
                  onApply={apply}
                  onBookmark={() => {}}
                />
              </div>
            ))}
          </div>
        </section>

      ) : (
        <EmptyState
          title="No Saved Jobs Yet"
          text="Bookmark jobs from the Jobs page to build your personal shortlist."
        />
      )}
    </StudentLayout>
  );
}