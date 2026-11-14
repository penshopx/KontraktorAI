import {
  getListAdminConsultationRequestsQueryKey,
  useGetCurrentUser,
  useListAdminConsultationRequests,
  useUpdateAdminConsultationRequest,
} from "@workspace/api-client-react";
import type { ConsultationRequestStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ClipboardList, RotateCw, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const statuses: Array<{ value: ConsultationRequestStatus; label: string }> = [
  { value: "received", label: "Diterima" },
  { value: "reviewing", label: "Sedang ditinjau" },
  { value: "follow_up", label: "Perlu tindak lanjut" },
  { value: "closed", label: "Selesai" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tanggal belum tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function AdminConsultationsPage() {
  const queryClient = useQueryClient();
  const [statusError, setStatusError] = useState("");
  const currentUser = useGetCurrentUser();
  const requests = useListAdminConsultationRequests({
    query: {
      queryKey: getListAdminConsultationRequestsQueryKey(),
      enabled: currentUser.data?.role === "admin",
    },
  });
  const updateRequest = useUpdateAdminConsultationRequest();

  function updateStatus(requestId: number, status: ConsultationRequestStatus) {
    setStatusError("");
    updateRequest.mutate(
      { requestId, data: { status } },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: getListAdminConsultationRequestsQueryKey() });
        },
        onError: () => setStatusError("Status belum tersimpan. Muat ulang antrean dan coba lagi."),
      },
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#101820] text-[#edf3f5]">
      <header className="border-b border-white/10 bg-[#0c141a]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <Link href="/my-gustafta" className="inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs text-[#d4e0e5] hover:border-[#8bdcff]/50 hover:text-white"><ArrowLeft size={14} /> My Gustafta</Link>
          <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[.12em] text-[#b8c7ce]"><ShieldCheck size={14} className="text-[#8bdcff]" /> ANTREAN FOUNDER</span>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-9 sm:px-8 sm:pt-12">
        <p className="eyebrow">AKSES ADMINISTRATOR · PENINJAUAN MANUAL</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="display-font text-3xl font-semibold text-[#f0f7fa] sm:text-4xl">Antrean konsultasi</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c0cdd2]">Permintaan dikirim dengan persetujuan pemilik akun. Founder meninjau setiap catatan secara manual; status yang Anda pilih akan terlihat oleh pemiliknya.</p>
          </div>
          {currentUser.data?.role === "admin" && !requests.isPending && !requests.isError && (
            <button type="button" onClick={() => void requests.refetch()} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-white/20 px-3 text-xs text-[#dce7eb] transition hover:border-[#8bdcff]/50 hover:text-white" data-testid="button-refresh-admin-consultations">
              <RotateCw size={13} /> Muat ulang antrean
            </button>
          )}
        </div>

        {currentUser.isPending ? <div className="mt-8 space-y-3" role="status" aria-label="Memeriksa akses akun"><div className="h-24 animate-pulse border border-white/10 bg-white/[.04]" /><div className="h-24 animate-pulse border border-white/10 bg-white/[.04]" /></div>
          : currentUser.isError ? <div className="mt-8 border border-rose-200/25 bg-rose-300/[.05] p-5" role="alert"><p className="text-sm text-rose-100">Akses akun belum dapat diperiksa.</p><button type="button" onClick={() => void currentUser.refetch()} className="mt-3 inline-flex min-h-9 items-center gap-2 border border-white/20 px-3 text-xs text-[#edf3f5] hover:border-[#8bdcff]/50" data-testid="button-retry-admin-access"><RotateCw size={13} /> Coba lagi</button></div>
          : currentUser.data?.role !== "admin" ? <div className="mt-8 border border-rose-200/20 bg-rose-300/[.04] p-5" role="alert" data-testid="error-admin-access"><p className="font-medium text-rose-100">Akses administrator diperlukan.</p><p className="mt-2 text-xs leading-5 text-[#b4c1c7]">Antrean ini hanya tersedia untuk akun yang perannya telah ditetapkan sebagai administrator.</p></div>
          : requests.isPending ? <div className="mt-8 space-y-4" role="status" aria-label="Memuat antrean konsultasi"><div className="h-36 animate-pulse border border-white/10 bg-white/[.04]" /><div className="h-36 animate-pulse border border-white/10 bg-white/[.04]" /></div>
          : requests.isError ? <div className="mt-8 border border-rose-200/20 bg-rose-300/[.04] p-5" role="alert"><p className="text-sm text-rose-100">Antrean belum dapat dimuat.</p><p className="mt-1 text-xs text-[#b4c1c7]">Data tidak berubah. Coba muat ulang untuk mencoba kembali.</p><button type="button" onClick={() => void requests.refetch()} className="mt-3 inline-flex min-h-9 items-center gap-2 border border-white/20 px-3 text-xs text-[#edf3f5] hover:border-[#8bdcff]/50" data-testid="button-retry-admin-queue"><RotateCw size={13} /> Coba lagi</button></div>
          : requests.data?.length ? <div className="mt-7 space-y-4" data-testid="admin-consultation-queue">
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3">
              <span className="inline-flex items-center gap-2 text-xs text-[#d8e4e8]"><ClipboardList size={14} className="text-[#8bdcff]" />{requests.data.length} {requests.data.length === 1 ? "permintaan" : "permintaan"} dalam antrean</span>
              <span className="text-[10px] text-[#aab9c0]">Pilih status untuk menyimpan pembaruan manual.</span>
            </div>
            {statusError && <p role="alert" className="border border-rose-200/20 bg-rose-300/[.05] p-4 text-xs text-rose-100" data-testid="error-admin-status-update">{statusError}</p>}
            {requests.data.map((request) => (
              <article key={request.id} className="border border-white/[.13] bg-[#141f26] p-5 sm:p-6" data-testid={`admin-consultation-${request.id}`}>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-[#edf4f6]">{request.purpose}</h2>
                    <a href={`mailto:${request.contactEmail}`} className="mt-2 inline-block break-all text-xs text-[#8bdcff] hover:text-white">{request.contactEmail}</a>
                  </div>
                  <label className="text-xs font-medium text-[#d0dce1]">Status tinjauan
                    <select aria-label={`Status permintaan ${request.id}`} value={request.status} disabled={updateRequest.isPending} onChange={(event) => void updateStatus(request.id, event.target.value as ConsultationRequestStatus)} className="mt-2 block min-h-11 w-full border border-[#52636c] bg-[#0d171d] px-3 text-xs text-[#f0f6f8] outline-none focus:border-[#8bdcff] focus:ring-2 focus:ring-[#8bdcff]/20 disabled:cursor-wait disabled:opacity-60 sm:w-52" data-testid={`select-consultation-status-${request.id}`}>
                      {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </label>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#c0ccd1]">{request.details}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-[10px] text-[#aebdc5]">
                  <span>Dikirim {formatDate(request.createdAt)}</span>
                  <span>Persetujuan {formatDate(request.consentedAt)}</span>
                  <span>Diperbarui {formatDate(request.updatedAt)}</span>
                  <span className="break-all">ID akun {request.userId}</span>
                </div>
              </article>
            ))}
          </div> : <div className="mt-7 border border-dashed border-white/15 p-8 text-center" data-testid="empty-admin-consultations"><p className="text-sm font-medium text-[#dce7eb]">Antrean masih kosong</p><p className="mt-2 text-xs text-[#9eafb7]">Permintaan pengguna yang mendapat persetujuan akan muncul di sini.</p></div>}
      </div>
    </main>
  );
}
