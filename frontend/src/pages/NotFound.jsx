import { navigate } from '../routes/router';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center content-center gap-4 bg-[#f6f8fb] text-[#14213d]">
      <h1 className="m-0 text-4xl font-black">Page not found</h1>
      <button className="min-h-10 rounded-lg border border-[#ffb73d] bg-[#ffb73d] px-4 font-semibold text-black transition hover:bg-[#f7a91f]" onClick={() => navigate('/')}>Go home</button>
    </main>
  );
}
