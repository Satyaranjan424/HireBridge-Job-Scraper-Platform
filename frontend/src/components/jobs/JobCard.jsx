import Pill from "../ui/Pill";
import {  } from "../../utils/format";

import {
  Building2,
  MapPin,
  BriefcaseBusiness,
  IndianRupee,
  Bookmark,
  Eye,
  Send,
} from "lucide-react";

export default function JobCard({
  job,
  onApply,
  onBookmark,
  onDetails,
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#F6B545] hover:shadow-xl">

      {/* Header */}
      <div className="border-b border-slate-100 p-6">

        <div className="flex items-start justify-between gap-5">

          <div className="flex gap-4">

            {/* Company Logo */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#132238] text-2xl font-bold text-white">
              {job.company?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <Pill tone={job.source === "INTERNAL" ? "green" : "blue"}>
                  {job.source || "INTERNAL"}
                </Pill>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  {job.employmentType || "Full-time"}
                </span>

              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#132238]">
                {job.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600">

                <span className="flex items-center gap-2">
                  <Building2 size={16} />
                  {job.company}
                </span>

                <span className="flex items-center gap-2">
                  <MapPin size={16} />
                  {job.location || "Remote"}
                </span>

                <span className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} />
                  {job.experience || "Fresher"}
                </span>

                <span className="flex items-center gap-2">
                  <IndianRupee size={16} />
                  {job.salaryRange || "Not Disclosed"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Description */}
      {/* <div className="px-6 pt-6">

        <p className="line-clamp-3 text-[15px] leading-7 text-slate-600">
          {job.description ||
            "No job description has been provided for this position."}
        </p>

        {job.requirements && (
          <div className="mt-5 flex flex-wrap gap-2">
            {asList(job.requirements)
              .slice(0, 5)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                >
                  {skill}
                </span>
              ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-4">

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Experience
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {job.experience || "Fresher"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Salary
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {job.salaryRange || "Negotiable"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Location
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {job.location || "Remote"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Type
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {job.employmentType || "Full-time"}
            </p>
          </div>

        </div>

      </div> */}

      {/* Footer Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 p-6">

        <button
          type="button"
          onClick={() => onDetails?.(job)}
          className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100"
        >
          <Eye size={17} />
          View Details
        </button>

        <button
          type="button"
          onClick={() => onBookmark(job)}
          className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 font-medium text-slate-700 transition-all duration-300 hover:bg-slate-100"
        >
          <Bookmark size={17} />
          Bookmark
        </button>

        <button
          type="button"
          onClick={() => onApply(job)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[#F6B545] px-6 font-semibold text-black shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-[#E7A92E]"
        >
          <Send size={17} />
          Apply Now
        </button>

      </div>

    </article>
  );
}