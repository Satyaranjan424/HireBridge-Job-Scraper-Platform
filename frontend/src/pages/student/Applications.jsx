import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import EmptyState from "../../components/common/EmptyState";
import Toast from "../../components/ui/Toast";

import { listApplications } from "../../api/jobApi";

import {
  BriefcaseBusiness,
  Clock3,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    listApplications()
      .then((data) =>
        setApplications(data.applications ?? [])
      )
      .catch((error) =>
        setMessage(error.message)
      );
  }, []);

  const applied = applications.filter(
    (item) => item.status === "APPLIED"
  ).length;

  const reviewing = applications.filter(
    (item) => item.status === "REVIEWING"
  ).length;

  const shortlisted = applications.filter(
    (item) => item.status === "SHORTLISTED"
  ).length;

  const rejected = applications.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const stats = [
    {
      title: "Applied",
      value: applied,
      icon: BriefcaseBusiness,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Reviewing",
      value: reviewing,
      icon: Clock3,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },
    {
      title: "Shortlisted",
      value: shortlisted,
      icon: CircleCheckBig,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: CircleX,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <StudentLayout
      active="applications"
      title="Applications"
    >
      <Toast
        message={message}
        onClose={() => setMessage("")}
      />

      {/* Statistics Cards */}
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

            {/* Applications Table */}
      {applications.length ? (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              My Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track the status of every job application you've submitted.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Position
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applied Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Source
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="border-t border-slate-200 px-6 py-5">
                      <div className="font-semibold text-slate-900">
                        {item.company}
                      </div>
                    </td>

                    <td className="border-t border-slate-200 px-6 py-5">
                      <div className="font-medium text-slate-700">
                        {item.title}
                      </div>
                    </td>

                    <td className="border-t border-slate-200 px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                          item.status === "SHORTLISTED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : item.status === "REVIEWING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="border-t border-slate-200 px-6 py-5 text-slate-600">
                      {new Date(item.appliedAt).toLocaleDateString()}
                    </td>

                    <td className="border-t border-slate-200 px-6 py-5">
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {item.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title="No Applications Yet"
          text="Start applying for jobs and your applications will appear here."
        />
      )}
    </StudentLayout>
  );
}