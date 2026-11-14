import {
  getListMyConsultationRequestsQueryKey,
  useCreateMyConsultationRequest,
  useListMyConsultationRequests,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, Clock3, RotateCw, Send, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

type ConsultationFields = {
  contactEmail: string;
  purpose: string;
  details: string;
  consent: boolean;
};

const statusCopy = {
  received: { label: "Diterima", description: "Tercatat dan menunggu tinjauan manual founder.", tone: "received" },
  reviewing: { label: "Sedang ditinjau", description: "Founder sedang meninjau permintaan ini secara manual.", tone: "reviewing" },
  follow_up: { label: "Perlu tindak lanjut", description: "Founder menandai permintaan ini untuk tindak lanjut.", tone: "follow_up" },
  closed: { label: "Ditutup", description: "Tinjauan permintaan ini telah ditutup.", tone: "closed" },
} as const;

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

export default function MyGustaftaConsultations({ email }: { email: string }) {
  const queryClient = useQueryClient();
  const requestsQuery = useListMyConsultationRequests();
  const createRequest = useCreateMyConsultationRequest();
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const form = useForm<ConsultationFields>({
    defaultValues: { contactEmail: email, purpose: "", details: "", consent: false },
  });

  useEffect(() => {
    if (email && !form.formState.isDirty) {
      form.setValue("contactEmail", email);
    }
  }, [email, form]);

  function submit(values: ConsultationFields) {
    setSubmitMessage("");
    setSubmitError("");
    createRequest.mutate(
      { data: { ...values, contactEmail: values.contactEmail.trim(), purpose: values.purpose.trim(), details: values.details.trim() } },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: getListMyConsultationRequestsQueryKey() });
          form.reset({ contactEmail: values.contactEmail, purpose: "", details: "", consent: false });
          setSubmitMessage("Permintaan tercatat dan menunggu peninjauan tim founder.");
        },
        onError: () => setSubmitError("Permintaan belum terkirim. Periksa koneksi lalu coba lagi."),
      },
    );
  }

  return (
    <section className="mt-6 border border-[#30434e] bg-[#111c23] p-5 sm:p-7" data-testid="my-gustafta-consultations">
      <div className="grid gap-7 lg:grid-cols-[.82fr_1.18fr]">
        <div>
          <div className="flex items-center gap-2"><ClipboardList size={16} className="text-[#8bdcff]" /><p className="eyebrow">MY REQUESTS</p></div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#eef5f7]">Minta tinjauan founder</h2>
          <p className="mt-2 text-xs leading-6 text-[#b9c6cc]">
            Ceritakan kebutuhan Anda. Setiap permintaan dibaca dan ditinjau secara manual oleh founder. Pengiriman formulir bukan konfirmasi konsultasi atau jadwal.
          </p>
          <div className="mt-5 border-l-2 border-[#8bdcff] bg-[#8bdcff]/[.07] p-4">
            <div className="flex gap-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#8bdcff]" />
              <div>
                <p className="text-xs font-semibold text-[#d9f3ff]">Proses manual, tanpa komitmen</p>
                <p className="mt-1 text-[11px] leading-5 text-[#c3d1d7]">
                  Belum ada pencocokan ahli otomatis maupun pembayaran yang aktif. Founder akan meninjau informasi ini untuk menentukan tindak lanjut.
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-4" data-testid="form-consultation-request">
              <FormField control={form.control} name="contactEmail" rules={{
                required: "Email kontak wajib diisi.",
                maxLength: { value: 254, message: "Email maksimal 254 karakter." },
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Masukkan email yang valid." },
              }} render={({ field, fieldState }) => (
                <FormItem>
                  <label htmlFor="consultation-email" className="block text-xs font-medium text-[#c8d5da]">Email untuk dihubungi</label>
                  <FormControl><input {...field} id="consultation-email" type="email" autoComplete="email" maxLength={254} className="mt-2 h-11 w-full border border-white/15 bg-[#0d171d] px-3 text-sm text-[#edf3f5] outline-none focus:border-[#8bdcff]/60" data-testid="input-consultation-email" /></FormControl>
                  {fieldState.error && <p className="mt-1 text-xs text-rose-300">{fieldState.error.message}</p>}
                </FormItem>
              )} />
              <FormField control={form.control} name="purpose" rules={{
                required: "Tujuan konsultasi wajib diisi.",
                minLength: { value: 8, message: "Tuliskan tujuan minimal 8 karakter." },
                maxLength: { value: 120, message: "Tujuan maksimal 120 karakter." },
              }} render={({ field, fieldState }) => (
                <FormItem>
                  <label htmlFor="consultation-purpose" className="block text-xs font-medium text-[#c8d5da]">Tujuan konsultasi</label>
                  <FormControl><input {...field} id="consultation-purpose" maxLength={120} placeholder="Contoh: memetakan otomasi administrasi proyek" className="mt-2 h-11 w-full border border-white/15 bg-[#0d171d] px-3 text-sm text-[#edf3f5] placeholder:text-[#71828a] outline-none focus:border-[#8bdcff]/60" data-testid="input-consultation-purpose" /></FormControl>
                  {fieldState.error && <p className="mt-1 text-xs text-rose-300">{fieldState.error.message}</p>}
                </FormItem>
              )} />
              <FormField control={form.control} name="details" rules={{
                required: "Rincian kebutuhan wajib diisi.",
                minLength: { value: 20, message: "Tambahkan rincian minimal 20 karakter." },
                maxLength: { value: 2000, message: "Rincian maksimal 2.000 karakter." },
              }} render={({ field, fieldState }) => (
                <FormItem>
                  <label htmlFor="consultation-details" className="block text-xs font-medium text-[#c8d5da]">Konteks dan kebutuhan</label>
                  <FormControl><textarea {...field} id="consultation-details" rows={5} maxLength={2000} placeholder="Jelaskan situasi, hasil yang ingin dicapai, dan informasi yang membantu tim meninjau permintaan." className="mt-2 w-full resize-y border border-white/15 bg-[#0d171d] px-3 py-3 text-sm leading-6 text-[#edf3f5] placeholder:text-[#71828a] outline-none focus:border-[#8bdcff]/60" data-testid="input-consultation-details" /></FormControl>
                  <div className="mt-1 flex justify-between gap-3 text-[10px] text-[#83949c]"><span>{fieldState.error?.message}</span><span>{field.value.length}/2.000</span></div>
                </FormItem>
              )} />
              <FormField control={form.control} name="consent" rules={{ validate: (value) => value || "Persetujuan diperlukan untuk mengirim permintaan." }} render={({ field, fieldState }) => (
                <FormItem>
                  <label htmlFor="consultation-consent" className="flex cursor-pointer items-start gap-3 border border-white/10 bg-white/[.025] p-4">
                    <FormControl><input ref={field.ref} name={field.name} onBlur={field.onBlur} id="consultation-consent" type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1 h-4 w-4 shrink-0 accent-[#8bdcff]" data-testid="checkbox-consultation-consent" /></FormControl>
                    <span className="text-[11px] leading-5 text-[#d0dce1]">Saya memberi persetujuan agar email, tujuan, dan rincian ini disimpan serta dibaca founder/admin untuk meninjau dan menindaklanjuti permintaan saya.</span>
                  </label>
                  {fieldState.error && <p className="mt-1 text-xs text-rose-300">{fieldState.error.message}</p>}
                </FormItem>
              )} />
              {submitError && <p role="alert" className="text-xs text-rose-300" data-testid="error-consultation-submit">{submitError}</p>}
              {submitMessage && <p role="status" className="text-xs text-[#a8e5c2]" data-testid="status-consultation-submit">{submitMessage}</p>}
              <button type="submit" disabled={createRequest.isPending} className="inline-flex min-h-11 items-center gap-2 bg-[#8bdcff] px-4 text-xs font-semibold text-[#0c1b23] transition hover:bg-[#b2e9ff] disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-consultation">
                {createRequest.isPending ? "Mengirim…" : "Kirim permintaan"} <Send size={14} />
              </button>
            </form>
          </Form>
        </div>

        <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <div className="flex items-center justify-between gap-3">
            <div><p className="eyebrow">RIWAYAT PERMINTAAN</p><h3 className="mt-2 text-lg font-semibold text-[#edf4f6]">Perkembangan tinjauan</h3></div>
            <button type="button" onClick={() => void requestsQuery.refetch()} className="inline-flex min-h-9 items-center gap-2 border border-white/15 px-3 text-[11px] text-[#c6d3d8] hover:border-[#8bdcff]/50 hover:text-white" data-testid="button-refresh-consultations"><RotateCw size={13} /> Muat ulang</button>
          </div>

          {requestsQuery.isPending ? (
            <div className="mt-5 space-y-3" role="status" aria-label="Memuat permintaan konsultasi"><div className="h-24 animate-pulse bg-white/[.06]" /><div className="h-24 animate-pulse bg-white/[.06]" /></div>
          ) : requestsQuery.isError ? (
            <div className="mt-5 border border-rose-200/20 p-4" role="alert" data-testid="error-consultations"><p className="text-sm text-rose-100">Permintaan belum dapat dimuat.</p><button type="button" onClick={() => void requestsQuery.refetch()} className="mt-3 inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs hover:border-[#8bdcff]/50"><RotateCw size={13} /> Coba lagi</button></div>
          ) : requestsQuery.data?.length ? (
            <div className="mt-5 space-y-3" data-testid="list-consultation-requests">
              {requestsQuery.data.map((request) => {
                const status = statusCopy[request.status];
                const statusStyles = status.tone === "closed"
                  ? "border-white/20 bg-white/[.06] text-[#d5e0e4]"
                  : status.tone === "follow_up"
                    ? "border-amber-200/30 bg-amber-200/[.08] text-amber-100"
                    : "border-[#8bdcff]/30 bg-[#8bdcff]/[.08] text-[#b9eaff]";
                return (
                  <article key={request.id} className="border border-white/[.13] bg-[#16232b] p-4 sm:p-5" data-testid={`consultation-request-${request.id}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="max-w-lg text-sm font-semibold leading-5 text-[#e7f0f3]">{request.purpose}</h4>
                      <span className={`border px-2.5 py-1 text-[10px] font-medium ${statusStyles}`} data-testid={`consultation-status-${request.id}`}>{status.label}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#a8b7bf]">{request.details}</p>
                    <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-5 text-[#c4d1d6]">{status.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#9aabb3]">
                      <span className="inline-flex items-center gap-1.5"><Clock3 size={12} className="text-[#8bdcff]" />Dikirim {formatDate(request.createdAt)}</span>
                      <span>Diperbarui {formatDate(request.updatedAt)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 border border-dashed border-white/15 p-6 text-center" data-testid="empty-consultation-requests">
              <p className="text-sm font-medium text-[#dce7eb]">Belum ada permintaan</p>
              <p className="mt-2 text-xs leading-5 text-[#9eafb7]">Setelah formulir dikirim, catatan dan statusnya akan tampil di sini.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
