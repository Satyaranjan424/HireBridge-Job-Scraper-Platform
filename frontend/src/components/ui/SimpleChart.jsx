import { ArrowRight } from "lucide-react";

export function BarChart({
  title,
  subtitle,
  data,
  actionLabel,
  onAction,
}) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.label}>

            <div className="mb-2 flex items-center justify-between">

              <span className="text-sm font-medium text-slate-700">
                {item.label}
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {item.value}
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-[#132238] transition-all duration-700"
                style={{
                  width: `${Math.max(
                    8,
                    (item.value / max) * 100
                  )}%`,
                }}
              />

            </div>

          </div>
        ))}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 flex w-full items-center justify-between rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-[#F6B545] hover:bg-[#FFF8EA]"
        >
          {actionLabel}

          <ArrowRight size={18} />
        </button>
      )}
    </section>
  );
}

export function DonutChart({
  title,
  subtitle,
  data,
  actionLabel,
  onAction,
}) {
  const total =
    data.reduce((sum, item) => sum + item.value, 0) || 1;

  const segments = data.reduce((items, item) => {
    const dash = (item.value / total) * 100;

    const previousOffset = items.length
      ? items[items.length - 1].nextOffset
      : 25;

    return [
      ...items,
      {
        ...item,
        dash,
        offset: previousOffset,
        nextOffset: previousOffset - dash,
      },
    ];
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[180px_1fr]">

        <div className="flex justify-center">

          <svg
            viewBox="0 0 42 42"
            className="h-[180px] w-[180px] -rotate-90"
          >
            <circle
              cx="21"
              cy="21"
              r="15.9"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="6"
            />

            {segments.map((item) => (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r="15.9"
                fill="none"
                stroke={
                  item.tone === "closed"
                    ? "#EF4444"
                    : "#132238"
                }
                strokeWidth="6"
                strokeDasharray={`${item.dash} ${100 - item.dash}`}
                strokeDashoffset={item.offset}
                className="transition-all duration-700"
              />
            ))}
          </svg>

        </div>

        <div className="space-y-5">

          {data.map((item) => (

            <div
              key={item.label}
              className="flex items-center justify-between"
            >

              <div className="flex items-center gap-3">

                <div
                  className={`h-3 w-3 rounded-full ${
                    item.tone === "closed"
                      ? "bg-red-500"
                      : "bg-[#132238]"
                  }`}
                />

                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>

              </div>

              <span className="font-semibold text-slate-900">
                {item.value}
              </span>

            </div>

          ))}

        </div>

      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 flex w-full items-center justify-between rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-[#F6B545] hover:bg-[#FFF8EA]"
        >
          {actionLabel}

          <ArrowRight size={18} />
        </button>
      )}
    </section>
  );
}