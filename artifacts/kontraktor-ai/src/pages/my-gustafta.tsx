import { useClerk, useUser } from "@clerk/react";
import {
  getGetCurrentUserConsentsQueryKey,
  useGetCurrentUser,
  useGetCurrentUserConsents,
  useUpdateCurrentUserConsents,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronRight, CircleUserRound, LockKeyhole, RotateCw, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

type ProfileFields = {
  firstName: string;
  lastName: string;
};

type ConsentFields = {
  analytics: boolean;
  marketing: boolean;
};

export default function MyGustaftaPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const currentUserQuery = useGetCurrentUser();
  const consentsQuery = useGetCurrentUserConsents();
  const updateConsents = useUpdateCurrentUserConsents();
  const profileForm = useForm<ProfileFields>({ defaultValues: { firstName: "", lastName: "" } });
  const consentForm = useForm<ConsentFields>({ defaultValues: { analytics: false, marketing: false } });
  const resetProfile = profileForm.reset;
  const resetConsents = consentForm.reset;
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [consentMessage, setConsentMessage] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      resetProfile({ firstName: user.firstName ?? "", lastName: user.lastName ?? "" });
    }
  }, [isLoaded, user?.id, user?.firstName, user?.lastName, resetProfile]);

  useEffect(() => {
    if (consentsQuery.data) {
      resetConsents({
        analytics: consentsQuery.data.analytics,
        marketing: consentsQuery.data.marketing,
      });
    }
  }, [consentsQuery.data, resetConsents]);

  const name = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Akun Gustafta";
  const email = user?.primaryEmailAddress?.emailAddress ?? "Email belum tersedia";
  const profileComplete = Boolean(user?.firstName?.trim() && user?.lastName?.trim());

  async function saveProfile(values: ProfileFields) {
    if (!user || !values.firstName.trim()) return;
    setProfileMessage("");
    setProfileError("");
    try {
      await user.update({ firstName: values.firstName.trim(), lastName: values.lastName.trim() || undefined });
      setProfileMessage("Nama profil berhasil diperbarui.");
    } catch {
      setProfileError("Nama belum dapat disimpan. Periksa koneksi lalu coba lagi.");
    }
  }

  function saveConsents(values: ConsentFields) {
    setConsentMessage("");
    updateConsents.mutate(
      { data: values },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: getGetCurrentUserConsentsQueryKey() });
          setConsentMessage("Preferensi Anda berhasil disimpan.");
        },
        onError: () => setConsentMessage("Preferensi belum dapat disimpan. Coba lagi sebentar."),
      },
    );
  }

  function formatDate(value?: string | null) {
    if (!value) return "Belum tersedia";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Belum tersedia";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  }

  return (
    <main className="min-h-[100dvh] bg-[#101820] text-[#edf3f5]">
      <div className="border-b border-white/10 bg-[#0c141a]">
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" data-testid="link-my-gustafta-home">
            <span className="grid h-10 w-10 place-items-center border border-[#8bdcff]/35 bg-[#8bdcff]/10 text-lg font-semibold text-[#8bdcff]">G</span>
            <span><span className="block font-semibold tracking-tight">My Gustafta</span><span className="mt-1 block font-mono text-[9px] tracking-[.15em] text-[#93a4ad]">KONTRAKTORAI · RUANG AKUN</span></span>
          </Link>
          <nav aria-label="Navigasi akun" className="flex items-center gap-2 sm:gap-3">
            <Link href="/my-gustafta/security" className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs text-[#d4e0e5] transition hover:border-[#8bdcff]/50 hover:text-white" data-testid="link-account-security"><LockKeyhole size={14} /> Keamanan</Link>
            <Link href="/" className="hidden min-h-10 items-center gap-2 px-3 text-xs text-[#aebdc5] hover:text-[#8bdcff] sm:inline-flex" data-testid="link-return-home">Portal publik <ArrowRight size={14} /></Link>
            <button type="button" onClick={() => void signOut({ redirectUrl: "/" })} className="min-h-10 border border-white/15 px-3 text-xs text-[#d4e0e5] transition hover:border-[#8bdcff]/50 hover:text-white" data-testid="button-sign-out">Keluar</button>
          </nav>
        </header>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:pt-14">
        <section className="relative overflow-hidden border border-[#283944] bg-[#121e26] p-6 sm:p-9" data-testid="my-gustafta-welcome">
          <div className="absolute right-[-30px] top-[-86px] h-64 w-64 rounded-full border border-[#8bdcff]/10 sm:right-10" />
          <div className="relative">
            <p className="eyebrow">RUANG PRIBADI · GUSTAFTA</p>
            <h1 className="display-font mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[#f0f7fa] sm:text-5xl">Selamat datang, <span className="text-[#8bdcff]">{name}</span></h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b5c3ca]">Kelola identitas akun dan pilihan privasi Anda di satu tempat. Akun Gustafta ini menjadi identitas bersama untuk KontraktorAI.</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 border px-3 py-2 text-[11px] ${profileComplete ? "border-[#74c9a4]/30 bg-[#74c9a4]/10 text-[#b4efd2]" : "border-[#8bdcff]/25 bg-[#8bdcff]/10 text-[#b9eaff]"}`} data-testid="status-profile-completeness">
                <span className={`h-1.5 w-1.5 rounded-full ${profileComplete ? "bg-[#74c9a4]" : "bg-[#8bdcff]"}`} />Profil {profileComplete ? "lengkap" : "belum lengkap"}
              </span>
              <Link href="/my-gustafta/security" className="inline-flex items-center gap-2 text-xs text-[#8bdcff] hover:text-white" data-testid="link-security-shortcut">Atur keamanan akun <ChevronRight size={14} /></Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.12fr_.88fr]">
          <section className="border border-[#d4e2e9] bg-[#e8f2f7] p-5 text-[#172a34] sm:p-7" data-testid="my-gustafta-profile-card">
            <div className="flex items-start justify-between gap-4">
              <div><div className="eyebrow !text-[#347890]">IDENTITAS PROFIL</div><h2 className="mt-2 text-xl font-semibold tracking-tight">Informasi dasar</h2></div>
              <span className="grid h-10 w-10 place-items-center border border-[#b7d4e0] bg-[#d9ebf3] text-[#347890]"><CircleUserRound size={19} /></span>
            </div>
            <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(saveProfile)} className="mt-6 space-y-4" data-testid="form-profile">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField control={profileForm.control} name="firstName" render={({ field }) => (
                  <FormItem><label className="block text-xs font-medium text-[#39515d]" htmlFor="profile-first-name">Nama depan
                    <FormControl><input {...field} id="profile-first-name" autoComplete="given-name" className="mt-2 h-11 w-full border border-[#b8ccd5] bg-[#f6fafc] px-3 text-sm text-[#162a34] outline-none transition focus:border-[#4386a0] focus:ring-2 focus:ring-[#4386a0]/15" data-testid="input-profile-first-name" /></FormControl>
                  </label></FormItem>
                )} />
                <FormField control={profileForm.control} name="lastName" render={({ field }) => (
                  <FormItem><label className="block text-xs font-medium text-[#39515d]" htmlFor="profile-last-name">Nama belakang
                    <FormControl><input {...field} id="profile-last-name" autoComplete="family-name" className="mt-2 h-11 w-full border border-[#b8ccd5] bg-[#f6fafc] px-3 text-sm text-[#162a34] outline-none transition focus:border-[#4386a0] focus:ring-2 focus:ring-[#4386a0]/15" data-testid="input-profile-last-name" /></FormControl>
                  </label></FormItem>
                )} />
              </div>
              <div className="border border-[#c8dbe3] bg-[#dcebf1] px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#54717e]">Email akun</span>
                <p className="mt-1 break-all text-sm text-[#1c3440]" data-testid="text-profile-email">{email}</p>
                <p className="mt-1 text-[10px] leading-5 text-[#59737e]">Email dan verifikasi dikelola oleh Clerk. Untuk perubahan email, buka pengaturan keamanan.</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#c8dbe3] pt-4">
                <p className="text-[10px] text-[#58717d]" data-testid="text-profile-owner-note">Nama profil disimpan oleh penyedia identitas Gustafta.</p>
                <button type="submit" disabled={!isLoaded || !profileForm.watch("firstName").trim() || !user || profileForm.formState.isSubmitting} className="inline-flex min-h-10 items-center gap-2 bg-[#142c38] px-4 text-xs font-semibold text-[#eff8fb] transition hover:bg-[#234858] disabled:cursor-not-allowed disabled:opacity-50" data-testid="button-save-profile">
                  {profileForm.formState.isSubmitting ? "Menyimpan…" : "Simpan nama"} <ArrowRight size={14} />
                </button>
              </div>
              {profileMessage && <p role="status" className="flex items-center gap-2 text-xs text-[#27694b]" data-testid="status-profile-save"><Check size={14} />{profileMessage}</p>}
              {profileError && <p role="alert" className="text-xs text-[#a03d43]" data-testid="error-profile-save">{profileError}</p>}
            </form>
            </Form>
          </section>

          <section className="border border-white/10 bg-[#141f26] p-5 sm:p-7" data-testid="my-gustafta-account-card">
            <div className="eyebrow">AKUN APLIKASI</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#edf4f6]">Catatan akun</h2>
            {currentUserQuery.isPending ? (
              <div className="mt-6 space-y-4" role="status" aria-label="Memuat catatan akun" data-testid="skeleton-account-data"><div className="h-10 animate-pulse bg-white/[.07]" /><div className="h-10 animate-pulse bg-white/[.07]" /></div>
            ) : currentUserQuery.isError ? (
              <div className="mt-5 border border-rose-200/20 bg-rose-300/[.06] p-4" role="alert" data-testid="error-account-data">
                <p className="text-sm text-rose-100">Catatan akun belum dapat dimuat.</p>
                <button type="button" onClick={() => void currentUserQuery.refetch()} className="mt-3 inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs text-[#e6eef1] hover:border-[#8bdcff]/50" data-testid="button-retry-profile"><RotateCw size={13} /> Coba lagi</button>
              </div>
            ) : currentUserQuery.data ? (
              <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-xs text-[#9bacb4]">Peran aplikasi</dt><dd className="text-sm font-medium text-[#eaf2f5]" data-testid="text-account-role">{currentUserQuery.data.role === "admin" ? "Administrator" : "Anggota"}</dd></div>
                <div className="flex items-center justify-between gap-4 py-4"><dt className="text-xs text-[#9bacb4]">Bergabung</dt><dd className="text-right text-sm text-[#eaf2f5]" data-testid="text-account-created">{formatDate(currentUserQuery.data.createdAt)}</dd></div>
              </dl>
            ) : <p className="mt-5 text-sm text-[#b3c0c6]" data-testid="empty-account-data">Catatan akun tidak tersedia.</p>}
            <p className="mt-4 text-[11px] leading-5 text-[#9bacb4]">Peran dan tanggal bergabung berasal dari catatan akun Gustafta, bukan dari formulir profil.</p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="eyebrow !text-[9px]">AREA BELUM TERSEDIA</p>
              <p className="mt-2 text-xs leading-5 text-[#aab8bf]" data-testid="text-unavailable-modules">Riwayat Concierge, pengetahuan tersimpan, dan permintaan belum tersedia di akun ini. Tidak ada aktivitas yang ditampilkan sampai fiturnya siap.</p>
            </div>
          </section>
        </div>

        <section className="mt-6 border border-[#30434e] bg-[#111c23] p-5 sm:p-7" data-testid="my-gustafta-consent-card">
          <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#8bdcff]" /><p className="eyebrow">PILIHAN PRIVASI</p></div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#eef5f7]">Kontrol yang tetap milik Anda</h2>
              <p className="mt-2 max-w-sm text-xs leading-6 text-[#a8b7bf]">Pilihan ini opsional, terpisah, dan tidak diperlukan untuk mengakses akun atau portal. Pengumpulan analitik dan pengiriman email pemasaran belum aktif; pilihan Anda akan disimpan untuk saat kanal tersebut tersedia.</p>
              {consentsQuery.data?.updatedAt && <p className="mt-4 text-[10px] text-[#80939d]" data-testid="text-consent-updated">Terakhir diperbarui {formatDate(consentsQuery.data.updatedAt)}</p>}
            </div>
            <div>
              {consentsQuery.isPending ? (
                <div className="space-y-3" role="status" aria-label="Memuat preferensi privasi" data-testid="skeleton-consents"><div className="h-[68px] animate-pulse bg-white/[.06]" /><div className="h-[68px] animate-pulse bg-white/[.06]" /></div>
              ) : consentsQuery.isError ? (
                <div role="alert" className="border border-rose-200/20 p-4" data-testid="error-consents"><p className="text-sm text-rose-100">Preferensi privasi belum dapat dimuat.</p><button type="button" onClick={() => void consentsQuery.refetch()} className="mt-3 inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs hover:border-[#8bdcff]/50" data-testid="button-retry-consents"><RotateCw size={13} /> Coba lagi</button></div>
              ) : (
                <Form {...consentForm}>
                <form onSubmit={consentForm.handleSubmit(saveConsents)} className="space-y-3" data-testid="form-consents">
                  <FormField control={consentForm.control} name="analytics" render={({ field }) => (
                    <FormItem><label className="flex cursor-pointer items-start justify-between gap-4 border border-white/10 bg-white/[.025] p-4 transition hover:border-[#8bdcff]/30" htmlFor="consent-analytics">
                      <span><span className="block text-sm font-medium text-[#e6eef1]">Analitik opsional</span><span className="mt-1 block text-[11px] leading-5 text-[#9eafb7]">Pengumpulan analitik belum aktif. Simpan pilihan ini untuk saat pengumpulan data analitik diaktifkan.</span></span>
                      <FormControl><input ref={field.ref} name={field.name} onBlur={field.onBlur} id="consent-analytics" type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1 h-4 w-4 shrink-0 accent-[#8bdcff]" data-testid="toggle-consent-analytics" /></FormControl>
                    </label></FormItem>
                  )} />
                  <FormField control={consentForm.control} name="marketing" render={({ field }) => (
                    <FormItem><label className="flex cursor-pointer items-start justify-between gap-4 border border-white/10 bg-white/[.025] p-4 transition hover:border-[#8bdcff]/30" htmlFor="consent-marketing">
                      <span><span className="block text-sm font-medium text-[#e6eef1]">Informasi dan pemasaran</span><span className="mt-1 block text-[11px] leading-5 text-[#9eafb7]">Pengiriman email dan pemasaran belum aktif. Simpan pilihan ini untuk saat kanal email diaktifkan.</span></span>
                      <FormControl><input ref={field.ref} name={field.name} onBlur={field.onBlur} id="consent-marketing" type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1 h-4 w-4 shrink-0 accent-[#8bdcff]" data-testid="toggle-consent-marketing" /></FormControl>
                    </label></FormItem>
                  )} />
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="min-h-5 text-xs text-[#a8d8ec]" role="status" data-testid="status-consents">{consentMessage}</p>
                    <button type="submit" disabled={updateConsents.isPending} className="inline-flex min-h-10 items-center gap-2 bg-[#8bdcff] px-4 text-xs font-semibold text-[#0c1b23] transition hover:bg-[#b2e9ff] disabled:cursor-wait disabled:opacity-60" data-testid="button-save-consents">{updateConsents.isPending ? "Menyimpan…" : "Simpan pilihan"} <ArrowRight size={14} /></button>
                  </div>
                </form>
                </Form>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[10px] text-[#82939c]">
          <span className="inline-flex items-center gap-2"><UserRound size={13} /> Identitas akun bersama Gustafta</span>
          <Link href="/" className="inline-flex items-center gap-2 text-[#8bdcff] hover:text-white" data-testid="link-footer-public-portal">Kembali ke portal publik <ArrowRight size={13} /></Link>
        </footer>
      </div>
    </main>
  );
}
