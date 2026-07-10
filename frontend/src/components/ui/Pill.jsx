export default function Pill({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-emerald-100 text-emerald-800',
    blue: 'bg-blue-100 text-blue-700',
    dark: 'bg-slate-800 text-slate-100',
    red: 'bg-red-100 text-red-700',
  };

  return <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-black uppercase ${tones[tone] ?? tones.default}`}>{children}</span>;
}
