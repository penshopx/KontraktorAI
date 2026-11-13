import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BriefcaseBusiness, Building2, Cpu,
  FileCheck2, Leaf, Menu, Search, ShieldCheck, Zap, X, Pickaxe,
} from 'lucide-react';

export const newsChannels = [
  'Konstruksi',
  'Energi',
  'Ketenagalistrikan',
  'Pertambangan',
  'Lingkungan',
  'Bisnis & Tender',
  'Regulasi & Profesi',
  'Teknologi & AI',
];

const demoDate = 'Contoh tanggal (demo): 12 Juni 2025';
const demoSource = 'Materi simulasi editorial KontraktorAI — bukan sumber berita';

export type Editorial = {
  slug: string;
  channel: string;
  title: string;
  dek: string;
  summary: string;
  impact: string;
  nextAction: string[];
  source: string;
  date: string;
  reading: string;
  solution: string;
  solutionHref: string;
  mark: string;
};

export const editorials: Editorial[] = [
  {
    slug: 'membaca-risiko-rantai-pasok-proyek',
    channel: 'Konstruksi',
    title: 'Rantai pasok proyek: cara membaca risiko sebelum pekerjaan dimulai',
    dek: 'Kerangka untuk menilai ketergantungan material, jadwal pemasok, dan ruang gerak tim proyek.',
    summary: 'Tulisan demo ini mengajak tim proyek melihat rantai pasok sebagai bagian dari perencanaan, bukan sekadar urusan pembelian. Peta sederhana atas item kritis, waktu pengadaan, dan alternatif dapat membantu percakapan risiko menjadi lebih konkret.',
    impact: 'Bagi kontraktor dan pemilik proyek, keterlambatan satu item penting dapat merambat ke urutan kerja, biaya, serta komitmen kepada pihak lain. Dampak aktual selalu bergantung pada kontrak, kondisi lapangan, dan kesiapan pemasok.',
    nextAction: ['Daftar material atau jasa yang paling menentukan jalur kritis.', 'Tandai waktu pengadaan, pihak penanggung jawab, dan opsi pengganti yang layak.', 'Tinjau asumsi bersama tim proyek sebelum menyepakati jadwal kerja.'],
    source: demoSource,
    date: demoDate,
    reading: '5 menit baca',
    solution: 'Mengelola proyek harian',
    solutionHref: '/#solusi',
    mark: '01',
  },
  {
    slug: 'menilai-kesiapan-efisiensi-energi',
    channel: 'Energi',
    title: 'Efisiensi energi di fasilitas: mulai dari data yang sudah tersedia',
    dek: 'Langkah awal untuk menyusun gambaran pemakaian energi tanpa buru-buru membeli sistem baru.',
    summary: 'Materi demo ini membahas cara mengawali evaluasi energi dengan catatan pemakaian, jam operasi, dan kondisi peralatan. Tujuannya bukan memberi angka penghematan, melainkan membangun dasar diskusi yang bisa ditinjau oleh tim operasional.',
    impact: 'Data yang tidak konsisten dapat membuat prioritas perbaikan meleset. Sebaliknya, pencatatan yang tertib memberi organisasi pijakan untuk membandingkan pola pemakaian dan menilai peluang secara bertahap.',
    nextAction: ['Kumpulkan tagihan, catatan meter, serta jadwal operasi yang relevan.', 'Sepakati satuan, periode pencatatan, dan siapa yang memvalidasi data.', 'Pilih area kecil untuk ditinjau bersama teknisi atau tenaga ahli.'],
    source: demoSource,
    date: demoDate,
    reading: '4 menit baca',
    solution: 'Memahami solusi industri',
    solutionHref: '/#solusi',
    mark: '02',
  },
  {
    slug: 'kesiapan-dokumen-pekerjaan-kelistrikan',
    channel: 'Ketenagalistrikan',
    title: 'Dokumen pekerjaan kelistrikan: pemeriksaan awal yang sering terlewat',
    dek: 'Susun alur pemeriksaan dokumen teknis, personel, dan keselamatan sesuai ruang lingkup pekerjaan.',
    summary: 'Contoh editorial ini menyajikan kerangka pemeriksaan awal, bukan daftar persyaratan resmi. Kebutuhan dokumen dapat berbeda menurut jenis pekerjaan, kontrak, lokasi, dan ketentuan yang berlaku.',
    impact: 'Ketidakselarasan antara ruang lingkup, kualifikasi personel, dan rencana kerja berpotensi menimbulkan jeda koordinasi. Pemeriksaan silang sebelum mobilisasi membantu tim menemukan pertanyaan lebih awal.',
    nextAction: ['Cocokkan dokumen dengan ruang lingkup dan persyaratan kontrak.', 'Pastikan penanggung jawab teknis dan kompetensi personel sudah teridentifikasi.', 'Verifikasi ketentuan terbaru melalui kanal resmi dan pihak berwenang.'],
    source: demoSource,
    date: demoDate,
    reading: '6 menit baca',
    solution: 'Menata keselamatan kerja',
    solutionHref: '/#solusi',
    mark: '03',
  },
  {
    slug: 'rencana-pemantauan-lingkungan-operasi',
    channel: 'Lingkungan',
    title: 'Menyusun rencana pemantauan lingkungan yang bisa dijalankan tim',
    dek: 'Hubungkan indikator, jadwal, tanggung jawab, dan bukti pencatatan dalam satu alur kerja.',
    summary: 'Materi simulasi ini menggambarkan prinsip dasar merancang pemantauan yang dapat dipahami pelaksana. Isi rencana perlu disesuaikan dengan persetujuan, kewajiban, karakter lokasi, dan arahan tenaga ahli.',
    impact: 'Rencana yang terlalu umum menyulitkan tim mengetahui kapan bertindak dan bagaimana menyimpan bukti. Pembagian peran yang terang membantu tindak lanjut lapangan lebih konsisten.',
    nextAction: ['Petakan kewajiban dan indikator yang memang berlaku untuk kegiatan Anda.', 'Tetapkan frekuensi, pelaksana, pemeriksa, serta format pencatatan.', 'Catat temuan dan eskalasikan ketidaksesuaian melalui prosedur internal.'],
    source: demoSource,
    date: demoDate,
    reading: '5 menit baca',
    solution: 'Menata keselamatan kerja',
    solutionHref: '/#solusi',
    mark: '04',
  },
  {
    slug: 'evaluasi-peluang-tender-secara-terukur',
    channel: 'Bisnis & Tender',
    title: 'Sebelum ikut tender: ukur kecocokan peluang dengan kapasitas usaha',
    dek: 'Cara menyaring peluang berdasarkan ruang lingkup, kemampuan tim, dokumen, dan arus kas.',
    summary: 'Tulisan demo ini menawarkan kerangka evaluasi peluang agar keputusan mengikuti tender tidak hanya berangkat dari nilai pekerjaan. Setiap kriteria perlu disesuaikan dengan kebijakan usaha dan dokumen pengadaan terkait.',
    impact: 'Peluang yang tidak sejalan dengan kapasitas dapat membebani tim dan modal kerja. Penyaringan awal membuat waktu penyusunan penawaran lebih terarah.',
    nextAction: ['Bandingkan lingkup dan jadwal dengan proyek yang sedang berjalan.', 'Tinjau persyaratan kualifikasi dan dokumen dari sumber pengadaan resmi.', 'Periksa kebutuhan modal kerja dan tetapkan keputusan lanjut atau tidak.'],
    source: demoSource,
    date: demoDate,
    reading: '4 menit baca',
    solution: 'Menyiapkan dokumen tender',
    solutionHref: '/#solusi',
    mark: '05',
  },
  {
    slug: 'memeriksa-perubahan-ketentuan-profesi',
    channel: 'Regulasi & Profesi',
    title: 'Memeriksa perubahan ketentuan: kebiasaan kerja yang melindungi keputusan',
    dek: 'Bangun proses verifikasi yang rapi sebelum perubahan aturan memengaruhi pekerjaan dan kompetensi.',
    summary: 'Contoh ini bukan ringkasan regulasi tertentu. Materi membahas kebiasaan mengidentifikasi aturan yang relevan, memastikan versi dan tanggal berlakunya, lalu mencatat dampak pada proses internal.',
    impact: 'Mengandalkan kutipan tanpa konteks atau versi yang jelas dapat menimbulkan tafsir berbeda. Jejak pemeriksaan membantu organisasi menjelaskan dasar keputusan kepada tim.',
    nextAction: ['Temukan naskah dan pengumuman melalui kanal resmi instansi terkait.', 'Periksa lingkup, tanggal berlaku, aturan turunan, dan ketentuan peralihan.', 'Minta penelaahan profesional bila penerapannya berdampak pada kontrak atau izin.'],
    source: demoSource,
    date: demoDate,
    reading: '5 menit baca',
    solution: 'Memahami kepatuhan usaha',
    solutionHref: '/#solusi',
    mark: '06',
  },
  {
    slug: 'kesiapan-operasi-pertambangan',
    channel: 'Pertambangan',
    title: 'Kesiapan operasi tambang: satukan rencana kerja, keselamatan, dan bukti',
    dek: 'Kerangka koordinasi untuk memastikan rencana dan praktik lapangan tetap tersambung.',
    summary: 'Materi demo ini menguraikan pertanyaan koordinasi yang dapat digunakan tim sebelum aktivitas dimulai. Ini bukan panduan teknis maupun pengganti prosedur, persetujuan, dan standar yang berlaku.',
    impact: 'Rencana yang terpisah dari komunikasi lapangan menyulitkan pengawasan perubahan kondisi. Penyelarasan peran dan jalur eskalasi membantu tim menjaga konsistensi pelaksanaan.',
    nextAction: ['Tinjau rencana kerja dan prosedur keselamatan yang disetujui.', 'Pastikan pelaksana memahami peran, batas kerja, dan jalur pelaporan.', 'Dokumentasikan pemeriksaan awal serta perubahan kondisi di lapangan.'],
    source: demoSource,
    date: demoDate,
    reading: '6 menit baca',
    solution: 'Menata keselamatan kerja',
    solutionHref: '/#solusi',
    mark: '07',
  },
  {
    slug: 'menggunakan-ai-dengan-pemeriksaan-manusia',
    channel: 'Teknologi & AI',
    title: 'AI untuk pekerjaan industri: tetapkan batas, periksa hasil, jaga konteks',
    dek: 'Prinsip praktis menggunakan alat AI sebagai pendamping, bukan sumber keputusan tanpa verifikasi.',
    summary: 'Tulisan simulasi ini membahas cara memulai penggunaan AI secara bertanggung jawab untuk menyusun draf, merangkum materi, atau mengelompokkan informasi. Hasil tetap perlu diperiksa dengan sumber yang sesuai.',
    impact: 'Keluaran AI dapat keliru, kehilangan konteks, atau memuat informasi sensitif bila digunakan tanpa aturan. Batas penggunaan dan pemeriksaan manusia membuat manfaatnya lebih terukur.',
    nextAction: ['Pilih tugas berisiko rendah dan hindari memasukkan data rahasia.', 'Periksa fakta, kutipan, angka, dan asumsi terhadap sumber yang berwenang.', 'Tetapkan penanggung jawab yang menyetujui hasil sebelum digunakan.'],
    source: demoSource,
    date: demoDate,
    reading: '4 menit baca',
    solution: 'Bertanya pada ahli',
    solutionHref: '/#solusi',
    mark: '08',
  },
];

function usePageMetadata(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const metaValues = [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
    ] as const;
    const previousValues = metaValues.map(([selector, value]) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previous = element?.content;
      if (element) element.content = value;
      return { element, previous };
    });

    document.title = title;
    return () => {
      document.title = previousTitle;
      previousValues.forEach(({ element, previous }) => {
        if (element && previous !== undefined) element.content = previous;
      });
    };
  }, [title, description]);
}

const channelIcons = [Building2, Zap, ShieldCheck, Pickaxe, Leaf, BriefcaseBusiness, FileCheck2, Cpu];

function NewsHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#101820]/95 backdrop-blur-xl">
    <div className="container-wide flex h-[72px] items-center justify-between">
      <Link href="/" className="brand-lockup flex items-center gap-2.5" data-testid="link-news-brand-home">
        <span className="brand-mark"><span /><span /><span /></span>
        <span className="flex flex-col leading-none">
          <span className="font-semibold tracking-[-.04em]">Kontraktor<span className="text-[#8bdcff]">AI</span></span>
          <span className="mt-1.5 font-mono text-[8px] tracking-[.13em] text-[#9aabb4]">BY GUSTAFTA</span>
        </span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi portal">
        <Link href="/" className="nav-link text-[13px]" data-testid="link-news-home">Beranda</Link>
        <Link href="/news" className="text-[13px] font-semibold text-[#8bdcff]" data-testid="link-news-current">News & Intelijen</Link>
        <Link href="/#solusi" className="nav-link text-[13px]" data-testid="link-news-solutions">Jelajahi solusi</Link>
      </nav>
      <button className="grid h-10 w-10 place-items-center border border-white/10 text-slate-100 md:hidden" aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'} aria-expanded={open} onClick={() => setOpen(!open)} data-testid="button-news-mobile-menu">{open ? <X size={19} /> : <Menu size={19} />}</button>
    </div>
    {open && <nav className="border-t border-white/10 bg-[#101820] px-5 py-3 md:hidden" aria-label="Navigasi seluler">
      <Link href="/" onClick={() => setOpen(false)} className="block border-b border-white/[.07] py-3 text-sm text-slate-200" data-testid="link-news-mobile-home">Beranda</Link>
      <Link href="/news" onClick={() => setOpen(false)} className="block border-b border-white/[.07] py-3 text-sm text-[#8bdcff]" data-testid="link-news-mobile-current">News & Intelijen</Link>
      <Link href="/#solusi" onClick={() => setOpen(false)} className="block py-3 text-sm text-slate-200" data-testid="link-news-mobile-solutions">Jelajahi solusi</Link>
    </nav>}
  </header>;
}

function DemoNotice() {
  return <div className="border-y border-[#e9b96e]/35 bg-[#342718] px-4 py-3 text-[12px] leading-5 text-[#ffe3b4]" role="note" data-testid="notice-demo-content">
    <strong className="font-semibold">DEMO KONTEN — BUKAN BERITA TERKINI ATAU TERVERIFIKASI.</strong> Contoh editorial untuk menunjukkan cara kerja modul. Belum terhubung ke sumber berita langsung atau proses redaksi.
  </div>;
}

function ChannelTag({ channel, lightBackground = false }: { channel: string; lightBackground?: boolean }) {
  return <span className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[10px] font-medium ${lightBackground ? 'border-[#81aec0] bg-[#e7f2f6] text-[#24566a]' : 'border-[#8bdcff]/25 bg-[#8bdcff]/[.08] text-[#a6e4fa]'}`} data-testid={`tag-channel-${channel.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{channel}</span>;
}

export function NewsLanding() {
  const [search, setSearch] = useState('');
  const [activeChannel, setActiveChannel] = useState('Semua kanal');
  usePageMetadata(
    'News & Intelijen Industri | KontraktorAI by Gustafta',
    'Contoh format editorial untuk portal industri KontraktorAI, brand vertikal Gustafta. Materi demo, bukan berita terkini atau terverifikasi.',
  );
  const filtered = useMemo(() => editorials.filter(item => {
    const matchesChannel = activeChannel === 'Semua kanal' || item.channel === activeChannel;
    const searchable = `${item.title} ${item.dek} ${item.summary} ${item.channel}`.toLowerCase();
    return matchesChannel && searchable.includes(search.trim().toLowerCase());
  }), [activeChannel, search]);
  return <main className="site-shell noise min-h-[100dvh] bg-[#111a20] text-[#edf3f5]">
    <NewsHeader />
    <DemoNotice />
    <section className="relative isolate overflow-hidden border-b border-white/[.08]">
      <div className="absolute inset-0 -z-10 grid-paper opacity-50" />
      <div className="container-wide grid gap-8 py-14 md:grid-cols-[1.15fr_.85fr] md:items-end md:py-20">
        <div className="reveal">
          <div className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-[#8bdcff]" />GUSTAFTA · BRAND INDUK <span className="text-[#71848d]">/</span> KONTRAKTORAI · NEWS INDUSTRI</div>
          <h1 className="display-font mt-5 max-w-[760px] text-[clamp(3.1rem,7vw,6rem)] font-semibold leading-[.96]">Baca konteks.<br /><span className="text-[#8bdcff]">Pilih langkah.</span></h1>
          <p className="mt-6 max-w-[580px] text-[15px] leading-7 text-[#a8b6c0]">KontraktorAI adalah portal solusi digital dan AI Gustafta untuk UMKM kontraktor dan profesional industri. Cakupan lima sektor berkembang bertahap: konstruksi; energi dan ketenagalistrikan; lalu pertambangan dan lingkungan.</p>
        </div>
        <div className="border border-white/10 bg-[#151f26] p-5 md:mb-1" data-testid="panel-news-editorial-status">
          <div className="flex items-center justify-between"><span className="eyebrow !text-[9px]">STATUS MODUL</span><span className="font-mono text-[10px] text-[#f0c77e]">PRATINJAU</span></div>
          <p className="mt-4 text-[13px] leading-6 text-[#c2cdd2]">Belum ada API berita, CMS, atau integrasi sumber langsung. Seluruh kartu di bawah adalah materi demo yang dirancang sebagai kerangka editorial.</p>
          <div className="mt-4 border-t border-white/10 pt-3 font-mono text-[9px] tracking-[.1em] text-[#7e919b]">8 KANAL · CONTOH EDITORIAL</div>
        </div>
      </div>
    </section>
    <section className="border-b border-white/[.08] bg-[#121c23] py-7">
      <div className="container-wide">
        <div className="mb-4 flex items-center justify-between"><h2 className="eyebrow">JELAJAHI DELAPAN KANAL</h2><span className="font-mono text-[10px] text-[#72838c]">01 — 08</span></div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {newsChannels.map((channel, index) => {
            const Icon = channelIcons[index];
            return <button key={channel} onClick={() => { setActiveChannel(channel); document.getElementById('daftar-artikel')?.scrollIntoView({ behavior: 'smooth' }); }} className={`group flex min-h-[58px] items-center gap-3 border px-3 text-left transition ${activeChannel === channel ? 'border-[#8bdcff]/50 bg-[#8bdcff]/[.1]' : 'border-white/[.09] bg-[#101920] hover:border-[#8bdcff]/40'}`} data-testid={`button-channel-${index}`}>
              <Icon size={16} className="shrink-0 text-[#8bdcff]" /><span className="text-[11px] leading-4 text-[#d7e1e5]">{channel}</span><ArrowUpRight size={13} className="ml-auto shrink-0 text-[#718792] group-hover:text-[#8bdcff]" />
            </button>;
          })}
        </div>
      </div>
    </section>
    <section id="daftar-artikel" className="bg-[#e8f0f3] py-14 text-[#15222a] md:py-20">
      <div className="container-wide">
        <div className="grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
          <div><div className="eyebrow !text-[#347890]">ARSIP DEMO EDITORIAL</div><h2 className="display-font mt-3 text-[clamp(2.4rem,4vw,3.8rem)] font-semibold leading-none">Pilih isu yang<br />dekat dengan kerja.</h2></div>
          <p className="max-w-[440px] text-[13px] leading-6 text-[#586b74] md:justify-self-end">Bukan umpan berita langsung. Setiap contoh menunjukkan format: konteks, dampak, dan tindakan lanjutan yang dapat ditinjau tim.</p>
        </div>
        <div className="mt-8 border-y border-[#c4d3da] py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kanal berita">
              {['Semua kanal', ...newsChannels].map((channel, index) => <button key={channel} onClick={() => setActiveChannel(channel)} className={`shrink-0 border px-3 py-2 text-[10px] transition ${activeChannel === channel ? 'border-[#173440] bg-[#173440] text-[#edf7fa]' : 'border-[#c5d4da] bg-[#f1f6f7] text-[#536872] hover:border-[#568da3]'}`} data-testid={`button-filter-news-${index}`}>{channel}</button>)}
            </div>
            <label className="relative block w-full shrink-0 lg:w-[270px]">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#69808c]" />
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari kanal atau topik..." className="h-10 w-full border border-[#c5d4da] bg-[#f4f8f9] pl-10 pr-3 text-[12px] text-[#182932] outline-none placeholder:text-[#86979f] focus:border-[#46839a]" data-testid="input-search-news" />
            </label>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] text-[#63747d]">
            <span data-testid="text-news-results">{filtered.length} contoh editorial</span>
            {(search || activeChannel !== 'Semua kanal') && <button onClick={() => { setSearch(''); setActiveChannel('Semua kanal'); }} className="inline-flex items-center gap-1 text-[#286c85] hover:underline" data-testid="button-reset-news"><X size={12} /> Hapus filter</button>}
          </div>
        </div>
        {filtered.length ? <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => <article key={item.slug} className="flex min-h-[275px] flex-col border border-[#c9d7dd] bg-[#f4f8f9] p-5 transition hover:border-[#76b7ce]" style={{ animationDelay: `${index * 35}ms` }} data-testid={`card-news-${item.slug}`}>
            <div className="flex items-center justify-between"><ChannelTag channel={item.channel} lightBackground /><span className="font-mono text-[9px] text-[#8a989e]">{item.mark}</span></div>
            <h3 className="mt-5 text-[18px] font-semibold leading-[1.3] tracking-[-.025em] text-[#1d303a]">{item.title}</h3>
            <p className="mt-2 flex-1 text-[12px] leading-6 text-[#667780]">{item.dek}</p>
            <div className="mt-5 flex items-center justify-between border-t border-[#d8e1e5] pt-3"><span className="text-[10px] text-[#637780]">{item.reading} · Demo</span><Link href={`/news/${item.slug}`} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#286c85] hover:gap-2.5" data-testid={`link-read-${item.slug}`}>Baca kerangka <ArrowRight size={13} /></Link></div>
          </article>)}
        </div> : <div className="mt-5 border border-dashed border-[#afc1c9] bg-[#f2f7f8] px-6 py-14 text-center" data-testid="empty-news-results">
          <div className="mx-auto grid h-11 w-11 place-items-center border border-[#c5d5db] text-[#51849a]"><Search size={18} /></div>
          <h3 className="mt-4 text-lg font-semibold text-[#233943]">Belum ada contoh yang cocok.</h3>
          <p className="mt-2 text-sm text-[#657983]">Ubah kata pencarian atau tampilkan kembali seluruh kanal.</p>
          <button onClick={() => { setSearch(''); setActiveChannel('Semua kanal'); }} className="mt-5 border border-[#8aa7b3] px-4 py-2 text-xs font-semibold text-[#315d6d] hover:bg-[#e0edf1]" data-testid="button-empty-news-reset">Tampilkan semua</button>
        </div>}
      </div>
    </section>
    <div className="container-wide flex flex-col gap-4 py-8 text-[11px] text-[#95a4ac] sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="inline-flex items-center gap-2 text-[#aebbc3] hover:text-[#8bdcff]" data-testid="link-news-footer-home"><ArrowLeft size={14} /> Kembali ke beranda KontraktorAI</Link>
      <span data-testid="text-news-footer-disclaimer">Informasi demo, tidak menggantikan verifikasi sumber resmi atau nasihat profesional.</span>
    </div>
  </main>;
}

export function NewsArticle() {
  const params = useParams<{ slug: string }>();
  const article = editorials.find(item => item.slug === params.slug);
  usePageMetadata(
    article ? `${article.title} | KontraktorAI News` : 'Artikel tidak ditemukan | KontraktorAI News',
    article
      ? `Contoh editorial demo: ${article.dek} Bukan berita terkini atau terverifikasi.`
      : 'Kerangka editorial tidak ditemukan. Kembali ke kanal News KontraktorAI.',
  );
  if (!article) return <main className="min-h-[100dvh] bg-[#111a20] text-[#edf3f5]"><NewsHeader /><div className="container-wide py-24" data-testid="empty-article-not-found"><div className="eyebrow">ARTIKEL TIDAK DITEMUKAN</div><h1 className="display-font mt-4 text-4xl font-semibold">Kerangka ini tidak tersedia.</h1><p className="mt-4 text-sm text-[#a8b6c0]">Kembali ke kanal untuk memilih contoh editorial yang tersedia.</p><Link href="/news" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#8bdcff]" data-testid="link-article-not-found-news"><ArrowLeft size={15} /> Kembali ke News</Link></div></main>;
  return <main className="site-shell noise min-h-[100dvh] bg-[#111a20] text-[#edf3f5]">
    <NewsHeader />
    <DemoNotice />
    <div className="container-wide py-7">
      <Link href="/news" className="inline-flex items-center gap-2 text-[12px] text-[#9cabb3] hover:text-[#8bdcff]" data-testid="link-article-back"><ArrowLeft size={14} /> Semua kanal News</Link>
    </div>
    <article className="container-wide grid gap-10 pb-16 md:grid-cols-[minmax(0,1fr)_290px] md:gap-16 md:pb-24">
      <div>
        <div className="flex flex-wrap items-center gap-3"><ChannelTag channel={article.channel} /><span className="font-mono text-[10px] text-[#83939b]">{article.reading}</span></div>
        <h1 className="display-font mt-6 max-w-[900px] text-[clamp(2.5rem,5.7vw,5.3rem)] font-semibold leading-[.99] tracking-[-.06em]" data-testid="text-article-title">{article.title}</h1>
        <p className="mt-6 max-w-[720px] text-[17px] leading-8 text-[#b8c5cb]" data-testid="text-article-dek">{article.dek}</p>
        <div className="mt-8 grid gap-3 border-y border-white/10 py-4 text-[11px] sm:grid-cols-2">
          <div><span className="eyebrow !text-[9px]">SUMBER</span><p className="mt-2 text-[#c3ced3]" data-testid="text-article-source">{article.source}</p></div>
          <div><span className="eyebrow !text-[9px]">TANGGAL</span><p className="mt-2 text-[#c3ced3]" data-testid="text-article-date">{article.date}</p></div>
        </div>
        <div className="mt-7 border border-[#e9b96e]/35 bg-[#342718] px-4 py-3 text-[11px] leading-5 text-[#ffe3b4]" data-testid="notice-article-demo">Materi simulasi untuk demonstrasi format editorial. Tidak menggambarkan peristiwa terkini, bukan berita terverifikasi, dan tidak memiliki rujukan berita eksternal.</div>
        <div className="mt-9 max-w-[760px]">
          <section className="border-l-2 border-[#8bdcff] pl-5" data-testid="section-article-summary"><div className="eyebrow !text-[9px]">RINGKASAN</div><p className="mt-3 text-[15px] leading-7 text-[#d4dfe3]">{article.summary}</p></section>
          <section className="mt-10 border-t border-white/10 pt-7" data-testid="section-article-impact"><div className="eyebrow !text-[9px]">DAMPAK BAGI PELAKU INDUSTRI</div><p className="mt-3 text-[14px] leading-7 text-[#b4c1c7]">{article.impact}</p></section>
          <section className="mt-10 border-t border-white/10 pt-7" data-testid="section-article-next-action"><div className="eyebrow !text-[9px]">LANGKAH BERIKUTNYA</div><ol className="mt-4 space-y-4">{article.nextAction.map((step, index) => <li key={step} className="grid grid-cols-[30px_1fr] gap-3"><span className="font-mono text-[10px] text-[#8bdcff]">0{index + 1}</span><span className="text-[13px] leading-6 text-[#c4d0d5]">{step}</span></li>)}</ol></section>
        </div>
      </div>
      <aside className="md:pt-2">
        <div className="sticky top-[100px] border border-white/10 bg-[#151f26] p-5" data-testid="panel-related-solution">
          <div className="flex items-center gap-2 text-[#8bdcff]"><BriefcaseBusiness size={16} /><span className="eyebrow !text-[9px]">HUBUNGKAN KE SOLUSI</span></div>
          <h2 className="mt-5 text-[17px] font-semibold text-[#e1eaed]">{article.solution}</h2>
          <p className="mt-2 text-[12px] leading-6 text-[#95a5ad]">Lanjutkan dari wawasan ini ke jalur solusi KontraktorAI yang berkaitan.</p>
          <Link href={article.solutionHref} className="mt-5 flex items-center justify-between border border-[#8bdcff]/35 bg-[#8bdcff]/[.07] px-3 py-3 text-[11px] font-semibold text-[#b8e9fb] transition hover:bg-[#8bdcff]/[.13]" data-testid="link-article-related-solution">{article.solution}<ArrowUpRight size={15} /></Link>
          <div className="mt-5 border-t border-white/10 pt-4 text-[10px] leading-5 text-[#778a94]">Periksa informasi dan persyaratan melalui sumber resmi sebelum mengambil keputusan.</div>
        </div>
      </aside>
    </article>
    <div className="border-t border-white/10 bg-[#0e171d]">
      <div className="container-wide flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[11px] text-[#8b9aa2]">Contoh editorial demo · KontraktorAI</span>
        <Link href="/news" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#8bdcff]" data-testid="link-article-more-news">Jelajahi kanal lainnya <ArrowRight size={14} /></Link>
      </div>
    </div>
  </main>;
}
