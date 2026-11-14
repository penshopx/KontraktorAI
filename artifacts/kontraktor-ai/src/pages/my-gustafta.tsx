import { useClerk, useUser } from "@clerk/react";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function MyGustaftaPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const currentUserQuery = useGetCurrentUser();

  const name =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Akun Gustafta";
  const email = user?.primaryEmailAddress?.emailAddress ?? "Email belum tersedia";

  return (
    <main className="min-h-[100dvh] bg-[#101820] px-4 py-8 text-[#edf3f5] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" className="flex items-center gap-3" data-testid="link-my-gustafta-home">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8bdcff]/25 bg-[#8bdcff]/10 text-lg font-semibold text-[#8bdcff]">G</span>
            <span>
              <span className="block font-semibold">My Gustafta</span>
              <span className="mt-1 block font-mono text-[9px] tracking-[.14em] text-[#84959e]">AKUN KONTRAKTORAI</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => void signOut({ redirectUrl: "/" })}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-[#c9d4da] transition hover:border-[#8bdcff]/50 hover:text-white"
            data-testid="button-sign-out"
          >
            Keluar
          </button>
        </header>

        <section className="mt-10">
          <div className="eyebrow">DASHBOARD AKUN · P0 FOUNDATION</div>
          <h1 className="display-font mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Selamat datang, {name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#9eacb5]">
            Identitas masuk memakai Clerk; peran aplikasi disimpan terpisah di database Gustafta. Pendaftaran baru selalu dimulai sebagai pengguna biasa.
          </p>
        </section>

        <section className="mt-7 grid gap-4 md:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6" data-testid="my-gustafta-profile-card">
            <div className="eyebrow">PROFIL DASAR</div>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-[10px] uppercase tracking-[.12em] text-[#80919a]">Nama</dt>
                <dd className="mt-1 text-sm text-[#e5edf0]">{name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[.12em] text-[#80919a]">Email</dt>
                <dd className="mt-1 break-all text-sm text-[#e5edf0]">{email}</dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-white/[.08] pt-4 text-[10px] leading-5 text-[#80919a]">
              Verifikasi email, reset kata sandi, dan pengelolaan kredensial ditangani oleh penyedia autentikasi.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-6" data-testid="my-gustafta-access-card">
            <div className="eyebrow">AKSES APLIKASI</div>
            {currentUserQuery.isPending ? (
              <p className="mt-5 text-sm text-[#9eacb5]" role="status">Memuat peran akun…</p>
            ) : currentUserQuery.isError ? (
              <div className="mt-5" role="alert">
                <p className="text-sm text-rose-200">Profil aplikasi belum dapat dimuat.</p>
                <button
                  type="button"
                  onClick={() => void currentUserQuery.refetch()}
                  className="mt-3 rounded-lg border border-white/15 px-3 py-2 text-xs text-[#d5e0e5] hover:border-[#8bdcff]/50"
                  data-testid="button-retry-profile"
                >
                  Coba lagi
                </button>
              </div>
            ) : (
              <>
                <p className="mt-5 text-sm text-[#e5edf0]">
                  {currentUserQuery.data?.role === "admin" ? "Administrator" : "Pengguna"}
                </p>
                <p className="mt-1 text-[10px] leading-5 text-[#80919a]">
                  Peran ini berasal dari database aplikasi dan tidak dapat ditentukan dari formulir pendaftaran.
                </p>
              </>
            )}
          </article>
        </section>

        <section className="mt-4 rounded-2xl border border-[#8bdcff]/15 bg-[#8bdcff]/[.035] p-5" data-testid="my-gustafta-foundation-status">
          <div className="eyebrow">STATUS FONDASI</div>
          <p className="mt-2 text-xs leading-6 text-[#a7b5bc]">
            Login email dan kata sandi serta verifikasi email dikelola oleh Clerk. Catatan aplikasi menyimpan ID Clerk dan peran default saja; modul lain akan muncul setelah benar-benar tersedia.
          </p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[#8bdcff] hover:text-white" data-testid="link-return-home">
            Kembali ke portal publik
          </Link>
        </section>
      </div>
    </main>
  );
}
