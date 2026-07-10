import { useEffect } from "react";
import { CircleCheckBig, X } from "lucide-react";

export default function Toast({
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed right-6 top-6 z-[999] animate-in slide-in-from-right-5 duration-300">
      <div className="flex min-w-[340px] max-w-md items-start gap-4 rounded-2xl border border-green-200 bg-white p-5 shadow-2xl">

        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
          <CircleCheckBig
            size={22}
            className="text-green-600"
          />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-slate-900">
            Success
          </h4>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}