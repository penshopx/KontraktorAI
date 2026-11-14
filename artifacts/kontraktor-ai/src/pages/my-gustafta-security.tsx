import { UserProfile, useClerk } from "@clerk/react";
import { ArrowLeft, ArrowUpRight, LockKeyhole } from "lucide-react";
import { Link } from "wouter";

export default function MyGustaftaSecurityPage() {
  const { signOut } = useClerk();

  return (
    <main className="min-h-[100dvh] bg-[#101820] text-[#edf3f5]">
      <div className="border-b border-white/10 bg-[#0c141a]">
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" data-testid="link-security-brand">
            <span className="grid h-10 w-10 place-items-center border border-[#8bdcff]/35 bg-[#8bdcff]/10 text-lg font-semibold text-[#8bdcff]">G</span>
            <span><span className="block font-semibold tracking-tight">My Gustafta</span><span className="mt-1 block font-mono text-[9px] tracking-[.15em] text-[#93a4ad]">KONTRAKTORAI · RUANG AKUN</span></span>
          </Link>
          <nav aria-label="Navigasi akun" className="flex items-center gap-2 sm:gap-3">
            <Link href="/my-gustafta" className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs text-[#d4e0e5] transition hover:border-[#8bdcff]/50 hover:text-white" data-testid="link-security-overview"><ArrowLeft size={14} /> Ikhtisar akun</Link>
            <Link href="/" className="hidden min-h-10 items-center gap-2 px-3 text-xs text-[#aebdc5] hover:text-[#8bdcff] sm:inline-flex" data-testid="link-security-public-portal">Portal publik <ArrowUpRight size={14} /></Link>
            <button type="button" onClick={() => void signOut({ redirectUrl: "/" })} className="min-h-10 border border-white/15 px-3 text-xs text-[#d4e0e5] transition hover:border-[#8bdcff]/50 hover:text-white" data-testid="button-security-sign-out">Keluar</button>
          </nav>
        </header>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:pt-14">
        <section className="mb-8 border border-[#283944] bg-[#121e26] p-6 sm:p-9" data-testid="security-intro">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center border border-[#8bdcff]/25 bg-[#8bdcff]/10 text-[#8bdcff]"><LockKeyhole size={21} /></span>
            <div>
              <p className="eyebrow">KEAMANAN IDENTITAS · CLERK</p>
              <h1 className="display-font mt-3 text-3xl font-semibold tracking-tight text-[#f0f7fa] sm:text-4xl">Akses akun, di tangan Anda.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#afbdc4]">Kelola alamat email, kata sandi, metode masuk, dan sesi melalui pengaturan identitas aman Gustafta. Operasi kredensial dikelola langsung oleh Clerk.</p>
            </div>
          </div>
        </section>
        <section className="overflow-hidden border border-[#31434d] bg-[#111a20] p-2 sm:p-5" aria-label="Pengaturan profil dan keamanan Clerk" data-testid="clerk-security-profile">
          <UserProfile routing="hash" />
        </section>
        <p className="mt-5 text-center text-[11px] leading-5 text-[#8fa0a8]" data-testid="text-security-provider-note">Perubahan kredensial dan sesi dilakukan langsung pada penyedia identitas. Gustafta tidak menyimpan kata sandi Anda.</p>
        <div className="mt-8 flex justify-center">
          <Link href="/my-gustafta" className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-4 text-xs text-[#dce7eb] hover:border-[#8bdcff]/50 hover:text-white" data-testid="link-security-back-to-account"><ArrowLeft size={14} /> Kembali ke My Gustafta</Link>
        </div>
      </div>
    </main>
  );
}
