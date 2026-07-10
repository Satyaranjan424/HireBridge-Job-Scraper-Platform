export default function EmptyState({ title, text }) {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white/80 p-6 text-[#14213d]">
      <h3 className="m-0 text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </section>
  );
}
