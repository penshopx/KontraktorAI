import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { NewsArticle, NewsLanding } from '@/pages/news';
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ClipboardCheck,
  Compass, HardHat, Leaf, Menu, MessagesSquare, Search, ShieldCheck, Sparkles, X,
  BriefcaseBusiness, Calculator, GraduationCap, FileCheck2, UsersRound, Wrench,
  Layers3,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Solution = {
  title: string;
  description: string;
  category: string;
  label: string;
  icon: typeof Wrench;
  tone: string;
};

const solutions: Solution[] = [
  { title: 'Mulai usaha kontraktor', description: 'Pahami langkah awal, legalitas dasar, dan hal yang perlu disiapkan sebelum mengambil pekerjaan.', category: 'Bisnis & legalitas', label: 'PANDUAN PRAKTIS', icon: BriefcaseBusiness, tone: 'blue' },
  { title: 'Menyiapkan dokumen tender', description: 'Kenali alur administrasi tender dan susun daftar dokumen yang perlu diperiksa.', category: 'Tender & kepatuhan', label: 'CHECKLIST', icon: FileCheck2, tone: 'amber' },
  { title: 'Mengelola proyek harian', description: 'Bawa jadwal, catatan lapangan, dan progres pekerjaan ke dalam ritme kerja yang lebih rapi.', category: 'Manajemen proyek', label: 'ALAT KERJA', icon: ClipboardCheck, tone: 'mint' },
  { title: 'Menghitung kebutuhan biaya', description: 'Buat estimasi awal pekerjaan dengan kerangka perhitungan yang mudah ditinjau kembali.', category: 'Alat digital', label: 'KALKULATOR', icon: Calculator, tone: 'violet' },
  { title: 'Meningkatkan kompetensi tim', description: 'Temukan materi belajar dan arah pengembangan keterampilan untuk peran konstruksi.', category: 'Akademi & kompetensi', label: 'PENGEMBANGAN', icon: GraduationCap, tone: 'blue' },
  { title: 'Menata keselamatan kerja', description: 'Bangun kebiasaan HSE melalui panduan, pengingat, dan langkah kerja yang lebih sadar risiko.', category: 'HSE & keberlanjutan', label: 'KESELAMATAN', icon: ShieldCheck, tone: 'amber' },
  { title: 'Mencari rekan kolaborasi', description: 'Jelajahi cara memperluas jaringan profesional dan membangun kerja sama yang relevan.', category: 'Kolaborasi', label: 'JEJARING', icon: UsersRound, tone: 'mint' },
  { title: 'Bertanya pada ahli', description: 'Petakan persoalan Anda sebelum mencari dukungan dari konsultan atau tenaga ahli.', category: 'AI & konsultasi', label: 'ARAHAN AHLI', icon: MessagesSquare, tone: 'violet' },
  { title: 'Memahami solusi industri', description: 'Jelajahi pendekatan dan topik khusus untuk tantangan konstruksi yang lebih spesifik.', category: 'Solusi industri', label: 'WAWASAN', icon: HardHat, tone: 'blue' },
];

const categories = ['Semua solusi', 'AI & konsultasi', 'Kolaborasi', 'Alat digital', 'Manajemen proyek', 'Tender & kepatuhan', 'HSE & keberlanjutan', 'Akademi & kompetensi', 'Bisnis & legalitas', 'Solusi industri'];

function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" data-testid="link-brand-home" className={`brand-lockup ${light ? 'text-[#e9f3f7]' : ''}`}>
    <span className="brand-mark"><span /><span /><span /></span>
    <span className="font-semibold tracking-[-.04em]">Kontraktor<span className="text-[#8bdcff]">AI</span></span>
  </Link>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [['Solusi', '#solusi'], ['Model bisnis', '#model-bisnis'], ['Cara kerja', '#cara-kerja'], ['Wawasan', '#wawasan'], ['News', '/news'], ['Tentang', '#tentang']];
  return <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#101820]/90 backdrop-blur-xl">
    <div className="container-wide flex h-[74px] items-center justify-between">
      <Brand />
      <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
        {links.map(([label, href]) => href === '/news' ? <Link key={label} href={href} className="nav-link text-[13px]" data-testid="link-nav-news">{label}</Link> : <a key={label} href={href} className="nav-link text-[13px]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <a href="#solusi" className="nav-link px-3 py-2 text-[13px]" data-testid="link-nav-jelajahi">Jelajahi</a>
        <a href="#mulai" className="btn-primary inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[13px] font-semibold" data-testid="link-nav-mulai">Temukan arah <ArrowRight size={15} /></a>
      </div>
      <button className="grid h-10 w-10 place-items-center rounded-md border border-white/10 text-slate-100 md:hidden" aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
        {menuOpen ? <X size={19} /> : <Menu size={19} />}
      </button>
    </div>
    {menuOpen && <nav className="border-t border-white/10 bg-[#101820] px-5 py-4 md:hidden" aria-label="Navigasi seluler">
      {links.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-white/[.07] py-3 text-sm text-slate-200" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>)}
      <a href="#mulai" onClick={() => setMenuOpen(false)} className="btn-primary mt-4 flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold" data-testid="link-mobile-mulai">Temukan arah <ArrowRight size={15} /></a>
    </nav>}
  </header>;
}

function Hero() {
  return <section id="beranda" className="relative isolate overflow-hidden border-b border-white/[.08]">
    <div className="absolute inset-0 -z-10 grid-paper opacity-60" />
    <div className="absolute -right-40 top-[-180px] -z-10 h-[670px] w-[670px] rounded-full border border-[#8bdcff]/10" />
    <div className="absolute -right-8 top-[-50px] -z-10 h-[420px] w-[420px] rounded-full border border-[#8bdcff]/10" />
    <div className="container-wide grid min-h-[635px] items-center gap-12 py-16 md:grid-cols-[1.02fr_.98fr] md:py-20">
      <div className="reveal">
        <div className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-8 bg-[#8bdcff]" />GUSTAFTA · IMPLEMENTASI INDUSTRI PERTAMA</div>
        <h1 className="display-font max-w-[730px] text-[clamp(3.3rem,7.2vw,6.65rem)] font-semibold leading-[.98] text-[#edf3f5]">
          Industri konstruksi<br />bergerak lebih jauh<br /><span className="text-[#8bdcff]">bersama.</span>
        </h1>
        <p className="mt-7 max-w-[510px] text-[16px] leading-7 text-[#a8b6c0] md:text-[17px]">KontraktorAI adalah ekosistem industri pertama Gustafta. Kami membantu bisnis dan profesional konstruksi Indonesia bergerak dari informasi menuju solusi praktis melalui AI, pengetahuan, dan kolaborasi.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#solusi" className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-3.5 text-sm font-semibold" data-testid="link-hero-explore">Jelajahi solusi <ArrowRight size={16} /></a>
          <a href="#cara-kerja" className="btn-outline inline-flex items-center gap-2 rounded-md px-5 py-3.5 text-sm font-medium" data-testid="link-hero-how">Lihat cara kerja <ArrowDown size={15} /></a>
        </div>
        <div className="mt-12 flex items-center gap-4 text-[12px] text-[#8d9aa4]">
          <span className="flex -space-x-2">
            {['UK','KM','AH'].map((item, i) => <span key={item} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#111a20] text-[9px] font-semibold ${i === 0 ? 'bg-[#c7e5eb] text-[#17313b]' : i === 1 ? 'bg-[#b2c8e2] text-[#202c42]' : 'bg-[#d9c7a9] text-[#34291b]'}`} data-testid={`avatar-persona-${i}`}>{item}</span>)}
          </span>
           <span>Dimulai bersama kontraktor UMKM dan profesional industri</span>
        </div>
      </div>
      <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-[510px]">
        <div className="absolute -inset-8 rounded-full bg-[#72c9ec]/[.055] blur-3xl" />
        <div className="relative overflow-hidden rounded-[3px] border border-[#69808d]/40 bg-[#151f26] shadow-[0_28px_100px_rgba(0,0,0,.45)]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded bg-[#8bdcff]/10 text-[#8bdcff]"><Compass size={17} /></span><div><div className="text-[12px] font-semibold text-[#ecf4f6]">Peta langkah Anda</div><div className="mt-0.5 text-[10px] text-[#82919b]">Pilih titik mulai. Kami bantu tunjukkan arah.</div></div></div>
            <span className="font-mono text-[10px] text-[#798992]">01 — 04</span>
          </div>
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between"><span className="eyebrow !text-[9px]">Apa yang sedang Anda hadapi?</span><span className="text-[10px] text-[#74838c]">Pilih salah satu</span></div>
            <a href="#solusi" className="group flex items-center justify-between border border-[#8bdcff]/45 bg-[#8bdcff]/[.08] px-4 py-4 text-left transition hover:bg-[#8bdcff]/[.13]" data-testid="link-map-business">
              <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center border border-[#8bdcff]/20 text-[#8bdcff]"><BriefcaseBusiness size={17} /></span><span><strong className="block text-[13px] font-medium text-[#eaf1f4]">Mengembangkan usaha</strong><small className="mt-1 block text-[11px] text-[#91a0a9]">Legalitas, tender, operasional</small></span></span><ArrowUpRight className="text-[#8bdcff] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={16} />
            </a>
            <a href="#solusi" className="group mt-2 flex items-center justify-between border border-white/[.09] px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[.025]" data-testid="link-map-project">
              <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center border border-white/10 text-[#a4b5bf]"><HardHat size={17} /></span><span><strong className="block text-[13px] font-medium text-[#dce5e9]">Menjalankan proyek</strong><small className="mt-1 block text-[11px] text-[#84939c]">Biaya, jadwal, keselamatan kerja</small></span></span><ArrowUpRight className="text-[#91a2ad]" size={16} />
            </a>
            <a href="#solusi" className="group mt-2 flex items-center justify-between border border-white/[.09] px-4 py-4 text-left transition hover:border-white/25 hover:bg-white/[.025]" data-testid="link-map-expertise">
              <span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center border border-white/10 text-[#a4b5bf]"><Sparkles size={17} /></span><span><strong className="block text-[13px] font-medium text-[#dce5e9]">Menguatkan keahlian</strong><small className="mt-1 block text-[11px] text-[#84939c]">Belajar, berbagi, berkolaborasi</small></span></span><ArrowUpRight className="text-[#91a2ad]" size={16} />
            </a>
          </div>
          <div className="flex items-center justify-between border-t border-white/[.08] px-5 py-3 text-[10px] text-[#71818b]"><span>Informasi menuju langkah yang dapat diterapkan</span><span className="flex items-center gap-1 font-mono"><span className="h-1.5 w-1.5 rounded-full bg-[#8bdcff]" /> EKOSISTEM</span></div>
        </div>
        <div className="absolute -bottom-7 -left-8 hidden border border-[#53636b] bg-[#111a20] px-4 py-3 md:block">
          <div className="eyebrow !text-[9px]">FOKUS KAMI</div><div className="mt-1 text-[12px] text-[#d7e1e5]">Dari masalah nyata, ke langkah yang relevan.</div>
        </div>
      </div>
    </div>
    <div className="container-wide flex items-center justify-between border-t border-white/[.08] py-4 text-[10px] text-[#77858d]">
       <span className="font-mono tracking-[.1em]">GUSTAFTA · EKOSISTEM INDUSTRI PERTAMA</span><a href="#solusi" className="inline-flex items-center gap-2 text-[#aebbc3] hover:text-[#8bdcff]" data-testid="link-hero-scroll">Lihat jalur eksplorasi <ArrowDown size={13} /></a>
    </div>
  </section>;
}

function SolutionCatalog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua solusi');
  const filtered = useMemo(() => solutions.filter(item => {
    const matchesCategory = category === 'Semua solusi' || item.category === category;
    const searchText = `${item.title} ${item.description} ${item.category} ${item.label}`.toLowerCase();
    return matchesCategory && searchText.includes(query.trim().toLowerCase());
  }), [category, query]);

  return <section id="solusi" className="bg-[#e8f0f3] py-20 text-[#15222a] md:py-28">
    <div className="container-wide">
      <div className="mb-12 grid gap-7 md:grid-cols-[.85fr_1.15fr] md:items-end">
        <div><div className="eyebrow !text-[#347890]">PETA SOLUSI KONTRAKTORAI</div><h2 className="display-font mt-4 text-[clamp(2.8rem,5.2vw,4.7rem)] font-semibold leading-[.98]">Masalah Anda,<br />mulai dari sini.</h2></div>
        <div className="max-w-[550px] pb-1 md:justify-self-end"><p className="text-[15px] leading-7 text-[#52636d]">Tidak harus tahu nama alatnya. Mulai dari kebutuhan hari ini, lalu jelajahi panduan, alat digital, materi belajar, dan bentuk dukungan yang berkaitan.</p></div>
      </div>
      <div className="mb-6 flex flex-col gap-4 border-y border-[#cad7dd] py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter kategori solusi">
          {categories.map((item, i) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-[11px] transition ${category === item ? 'border-[#122a35] bg-[#122a35] text-[#e9f5f8]' : 'border-[#c7d4da] text-[#566974] hover:border-[#46839a] hover:text-[#1c5167]'}`} data-testid={`button-filter-${i}`}>{item}</button>)}
        </div>
        <label className="relative block w-full shrink-0 lg:w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#69808c]" />
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari masalah atau solusi..." className="h-11 w-full border border-[#c5d4da] bg-[#f4f8f9] pl-10 pr-4 text-[12px] text-[#182932] outline-none placeholder:text-[#86979f] focus:border-[#46839a] focus:ring-2 focus:ring-[#65b8d7]/20" data-testid="input-search-solutions" />
        </label>
      </div>
      <div className="mb-5 flex items-center justify-between text-[11px] text-[#63747d]">
        <span data-testid="text-results-count">{filtered.length} topik untuk dijelajahi</span>
        {(query || category !== 'Semua solusi') && <button onClick={() => { setQuery(''); setCategory('Semua solusi'); }} className="inline-flex items-center gap-1.5 text-[#286c85] hover:underline" data-testid="button-reset-filters"><X size={13} /> Hapus filter</button>}
      </div>
      {filtered.length > 0 ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item, index) => {
          const Icon = item.icon;
          return <article key={item.title} className="catalog-card group flex min-h-[222px] flex-col border border-[#c9d7dd] bg-[#f4f8f9] p-5 transition hover:border-[#76b7ce] hover:bg-white" style={{ animationDelay: `${index * 35}ms` }} data-testid={`card-solution-${index}`}>
            <div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center border ${item.tone === 'amber' ? 'border-[#dac8a5] bg-[#f3ead8] text-[#8e6d32]' : item.tone === 'mint' ? 'border-[#b9d4ca] bg-[#e2eee8] text-[#3b7964]' : item.tone === 'violet' ? 'border-[#cec1d9] bg-[#eee7f2] text-[#725a88]' : 'border-[#b8d2db] bg-[#e1eef2] text-[#38768c]'}`}><Icon size={18} /></span><span className="font-mono text-[9px] tracking-[.12em] text-[#81929a]">{item.label}</span></div>
            <h3 className="mt-5 text-[17px] font-semibold tracking-[-.025em] text-[#1d303a]">{item.title}</h3>
            <p className="mt-2 flex-1 text-[12px] leading-[1.7] text-[#667780]">{item.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-[#d8e1e5] pt-3"><span className="text-[10px] font-medium text-[#637780]">{item.category}</span><a href="#cara-kerja" aria-label={`Pelajari ${item.title}`} className="grid h-7 w-7 place-items-center text-[#3b8098] transition group-hover:translate-x-1" data-testid={`link-solution-${index}`}><ArrowRight size={16} /></a></div>
          </article>;
        })}
      </div> : <div className="border border-dashed border-[#afc1c9] bg-[#f2f7f8] px-6 py-14 text-center" data-testid="empty-solutions">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#dce9ed] text-[#51849a]"><Search size={19} /></div>
        <h3 className="mt-4 text-lg font-semibold text-[#233943]">Belum ada topik yang cocok.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#657983]">Coba kata kunci yang lebih umum atau pilih kategori lain. Kebutuhan Anda tetap bisa dimulai dari sini.</p>
        <button onClick={() => { setQuery(''); setCategory('Semua solusi'); }} className="mt-5 rounded-md border border-[#8aa7b3] px-4 py-2 text-xs font-semibold text-[#315d6d] hover:bg-[#e0edf1]" data-testid="button-empty-reset">Tampilkan semua solusi</button>
      </div>}
      <p className="mt-5 flex items-center gap-2 text-[10px] text-[#788991]"><Check size={13} className="text-[#42869d]" /> Konten yang ditampilkan adalah titik awal eksplorasi, bukan pengganti konsultasi profesional.</p>
    </div>
  </section>;
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Mulai dari situasi Anda', description: 'Tentukan apa yang sedang ingin dibereskan—bisnis, proyek, kepatuhan, atau pengembangan diri.', icon: Compass },
    { number: '02', title: 'Temukan jalur yang relevan', description: 'Jelajahi sumber pengetahuan, alat digital, dan dukungan yang berhubungan dengan kebutuhan.', icon: Search },
    { number: '03', title: 'Ambil langkah berikutnya', description: 'Gunakan materi sebagai panduan untuk berdiskusi, belajar, atau menata cara kerja.', icon: ArrowUpRight },
  ];
  return <section id="cara-kerja" className="relative border-b border-white/[.08] bg-[#121c23] py-20 md:py-28">
    <div className="container-wide">
      <div className="grid gap-10 md:grid-cols-[.82fr_1.18fr]">
        <div><div className="eyebrow">SEBUAH CARA YANG LEBIH JELAS</div><h2 className="display-font mt-4 max-w-[430px] text-[clamp(2.6rem,4.5vw,4rem)] font-semibold leading-[1.02]">Dari persoalan,<br /><span className="text-[#8bdcff]">ke langkah nyata.</span></h2><p className="mt-5 max-w-[400px] text-[14px] leading-7 text-[#9baab2]">KontraktorAI menyatukan berbagai pintu masuk ekosistem konstruksi. Bukan untuk menggantikan keahlian Anda—melainkan membantu melihat pilihan dengan lebih terang.</p>
          <Link href="/news" className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold text-[#8bdcff] hover:gap-3" data-testid="link-how-insights">Lihat intelijen industri <ArrowRight size={14} /></Link>
        </div>
        <div className="divide-y divide-white/[.1] border-y border-white/[.1]">
          {steps.map(step => {
            const Icon = step.icon;
            return <div key={step.number} className="grid gap-4 py-6 sm:grid-cols-[52px_1fr_32px] sm:items-center" data-testid={`step-${step.number}`}>
              <span className="font-mono text-[11px] text-[#78c9e8]">{step.number}</span>
              <div><h3 className="text-[16px] font-semibold text-[#e7eef1]">{step.title}</h3><p className="mt-1.5 max-w-[500px] text-[12px] leading-6 text-[#91a0a8]">{step.description}</p></div>
              <Icon size={20} className="hidden text-[#7f9eac] sm:block" />
            </div>;
          })}
        </div>
      </div>
    </div>
  </section>;
}

function BusinessModel() {
  const units = [
    { no: '01', title: 'Digital Development', text: 'Pengembangan digital untuk kebutuhan proses, data, dan cara kerja industri.', icon: Layers3 },
    { no: '02', title: 'SaaS & AI Products', text: 'Produk perangkat lunak dan kapabilitas AI yang dirancang untuk konteks pekerjaan nyata.', icon: Sparkles },
    { no: '03', title: 'Consulting & Advisory', text: 'Pendampingan dan perspektif ahli untuk membantu organisasi menentukan langkah.', icon: Compass },
    { no: '04', title: 'Knowledge & Academy', text: 'Pengetahuan terapan dan pengembangan kompetensi bagi pelaku industri.', icon: BookOpen },
    { no: '05', title: 'Business Collaboration', text: 'Kolaborasi yang mempertemukan kebutuhan, keahlian, dan peluang yang relevan.', icon: UsersRound },
    { no: '06', title: 'Industry Solutions', text: 'Solusi lintas bidang yang bertumbuh dari tantangan spesifik sektor.', icon: HardHat },
  ];
  const phases = [
    { id: '01', title: 'Mulai dari pekerjaan nyata', items: 'Project work · Consulting · Training · Produk pengetahuan digital', note: 'Fondasi awal untuk arus kas dan validasi kebutuhan pelanggan.' },
    { id: '02', title: 'Bangun penggunaan berulang', items: 'SaaS subscription · AI usage credits', note: 'Dikembangkan seiring solusi menemukan kebutuhan dan pola penggunaan yang tepat.' },
    { id: '03', title: 'Perkuat hubungan pelanggan', items: 'Membership · Enterprise licensing', note: 'Peluang setelah produk, dukungan, dan proposisi nilai siap.' },
    { id: '04', title: 'Perluas kolaborasi pasar', items: 'Marketplace · Komisi transaksi · Sponsored content', note: 'Bergantung pada mitra, kepercayaan, verifikasi, dan aktivitas transaksi.' },
    { id: '05', title: 'Kembangkan intelijen industri', items: 'Industry reports · API · Enterprise ecosystem', note: 'Arah lanjutan setelah model dan fondasi data tervalidasi.' },
  ];
  return <section id="model-bisnis" className="relative overflow-hidden border-y border-white/[.08] bg-[#111c23] py-20 md:py-28">
    <div className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full border border-[#8bdcff]/[.08]" />
    <div className="container-wide relative">
      <div className="grid gap-8 border-b border-white/10 pb-9 md:grid-cols-[1fr_.72fr] md:items-end">
      <div><div className="eyebrow">ARAH MODEL BISNIS · BAGIAN 02</div><h2 className="display-font mt-4 max-w-[740px] text-[clamp(2.7rem,5vw,4.8rem)] font-semibold leading-[.98]">Satu ekosistem.<br /><span className="text-[#8bdcff]">Enam cara mencipta nilai.</span></h2></div>
        <p className="max-w-[470px] text-[13px] leading-6 text-[#a4b2ba]">Model hibrida menghubungkan layanan, produk, pengetahuan, dan kolaborasi. Fokus pelanggan awal: UMKM kontraktor serta profesional industri.</p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-[#8bdcff] bg-[#8bdcff]/[.055] px-4 py-3 text-[11px] leading-5 text-[#c4d2d9]" data-testid="status-business-model-recommendation">
        <span className="font-mono text-[9px] tracking-[.12em] text-[#8bdcff]">ARAH DISETUJUI · VALIDASI BERLANJUT</span>
        <span>Model, segmen awal, dan prioritas pendapatan 12 bulan telah dipilih; harga dan unit economics tetap perlu diuji.</span>
      </div>
      <div className="mt-8 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3">
        {units.map(unit => {
          const Icon = unit.icon;
          return <article key={unit.no} className="group min-h-[166px] bg-[#121e26] p-5 transition-colors hover:bg-[#172832]" data-testid={`business-unit-${unit.no}`}>
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[#78c9e8]">{unit.no} / 06</span><Icon size={17} className="text-[#83cfe9]" /></div>
            <h3 className="mt-5 text-[15px] font-semibold tracking-[-.02em] text-[#e5edf0]">{unit.title}</h3>
            <p className="mt-2 max-w-[330px] text-[11px] leading-5 text-[#93a3ac]">{unit.text}</p>
          </article>;
        })}
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-[.72fr_1.28fr]">
        <div><div className="eyebrow">URUTAN PENGEMBANGAN PENDAPATAN</div><h3 className="display-font mt-3 max-w-[350px] text-3xl font-semibold leading-tight text-[#e6eef1]">Bertumbuh dari layanan ke skala.</h3><p className="mt-4 max-w-[350px] text-[12px] leading-6 text-[#91a0a8]">Prioritas 12 bulan pertama dimulai dari jasa dan konsultasi, sambil mengembangkan SaaS bertahap.</p></div>
        <div className="divide-y divide-white/[.1] border-y border-white/[.1]">
          {phases.map(phase => <article key={phase.id} className="grid gap-3 py-5 sm:grid-cols-[44px_1fr]" data-testid={`business-phase-${phase.id}`}>
            <span className="font-mono text-[11px] text-[#8bdcff]">{phase.id}</span>
            <div><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-[14px] font-semibold text-[#e5edf0]">{phase.title}</h4><span className="font-mono text-[9px] tracking-[.1em] text-[#758792]">TAHAP {phase.id}</span></div>
              <p className="mt-2 text-[12px] leading-5 text-[#c2d0d6]">{phase.items}</p><p className="mt-1 text-[10px] leading-5 text-[#8798a1]">{phase.note}</p></div>
          </article>)}
        </div>
      </div>
      <p className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#778991]" data-testid="text-business-model-caveat"><Check size={13} className="mt-0.5 shrink-0 text-[#70bfdc]" />Arah bisnis telah disepakati; harga, margin, dan proyeksi tetap perlu divalidasi. Bagian ini tidak menyatakan layanan atau produk tertentu telah tersedia.</p>
    </div>
  </section>;
}

function Ecosystem() {
  const tracks = [
    { icon: MessagesSquare, name: 'AI & konsultasi', detail: 'Panduan awal dan perspektif ahli untuk membantu memetakan persoalan.' },
    { icon: Wrench, name: 'Alat digital & proyek', detail: 'Pendukung kerja untuk perencanaan, administrasi, dan pengelolaan pekerjaan.' },
    { icon: FileCheck2, name: 'Tender & kepatuhan', detail: 'Wawasan seputar perizinan, tender, dokumen, dan praktik kepatuhan.' },
    { icon: Leaf, name: 'HSE & keberlanjutan', detail: 'Sumber pengetahuan untuk keselamatan kerja dan praktik yang lebih bertanggung jawab.' },
    { icon: BookOpen, name: 'Akademi & kompetensi', detail: 'Materi belajar dan pengembangan kapasitas bagi profesional konstruksi.' },
    { icon: UsersRound, name: 'Kolaborasi & jejaring', detail: 'Ruang untuk mengenal kebutuhan, bertukar wawasan, dan membuka peluang kerja sama.' },
  ];
  const marketWaves = [
    { number: '01', title: 'Konstruksi', detail: 'Fokus pertama: kontraktor UMKM dan profesional industri.' },
    { number: '02', title: 'Energi & ketenagalistrikan', detail: 'Ekspansi bersama ke kebutuhan sektor yang beririsan dengan proyek.' },
    { number: '03', title: 'Pertambangan & lingkungan', detail: 'Perluasan setelah model awal memberi pembelajaran dan terbukti berjalan.' },
  ];
  return <section id="tentang" className="bg-[#0e171d] py-20 md:py-28">
    <div className="container-wide">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div><div className="eyebrow">GUSTAFTA · TRILOGI GUSTAFTA · KONTRAKTORAI</div><h2 className="display-font mt-4 max-w-[700px] text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[.98]">Satu manifesto.<br />Solusi untuk industri.</h2></div>
        <p className="max-w-[380px] text-[13px] leading-6 text-[#9ba9b1]">Gustafta adalah brand induk. Trilogi Gustafta menjadi manifesto dan metodologi; KontraktorAI menerapkannya sebagai ekosistem industri pertama.</p>
      </div>
      <div className="grid border-b border-white/10 py-7 md:grid-cols-3">
        <article className="border-b border-white/[.09] py-5 md:border-b-0 md:border-r md:pr-7" data-testid="brand-gustafta">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">BRAND INDUK</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">Gustafta</h3>
          <p className="mt-2 text-[12px] leading-5 text-[#91a0a8]">Ekosistem bisnis dan inovasi berbasis pengetahuan, kolaborasi, dan AI.</p>
          <p className="mt-4 text-[11px] font-medium text-[#c5d5dc]">Knowledge, Collaboration &amp; Creation through AI</p>
        </article>
        <article className="border-b border-white/[.09] py-5 md:border-b-0 md:border-r md:px-7" data-testid="brand-trilogi">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">MANIFESTO &amp; METODOLOGI</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">Trilogi Gustafta</h3>
          <p className="mt-2 text-[12px] leading-6 text-[#91a0a8]">Dari Monolog ke Dialog.<br />Dari Dialog ke Kolaborasi.<br />Dari Dialog ke Kreasi.</p>
        </article>
        <article className="py-5 md:pl-7" data-testid="brand-kontraktorai">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">EKOSISTEM INDUSTRI PERTAMA</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">KontraktorAI</h3>
          <p className="mt-2 text-[12px] leading-5 text-[#91a0a8]">Penerapan Trilogi Gustafta untuk pasar konstruksi, energi, ketenagalistrikan, pertambangan, dan lingkungan.</p>
        </article>
      </div>
      <div className="py-8" data-testid="market-entry-waves">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><div className="eyebrow">FOKUS PASAR AWAL</div><h3 className="display-font mt-3 text-3xl font-semibold text-[#e7eef1] md:text-4xl">Bertahap, bukan serentak.</h3></div>
          <p className="max-w-[390px] text-[12px] leading-5 text-[#91a0a8]">Lima sektor membentuk satu ekosistem industri yang saling beririsan. Pemasaran dimulai dari konstruksi, lalu berkembang setelah model awal terbukti.</p>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {marketWaves.map((wave) => <article key={wave.number} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`market-wave-${wave.number}`}>
            <div className="font-mono text-[10px] text-[#8bdcff]">GELOMBANG {wave.number}</div>
            <h4 className="mt-2 text-[14px] font-semibold text-[#e1eaed]">{wave.title}</h4>
            <p className="mt-2 text-[11px] leading-5 text-[#91a0a8]">{wave.detail}</p>
          </article>)}
        </div>
      </div>
      <div className="border-t border-white/10 pt-8">
        <div className="eyebrow">SOLUSI DI DALAM EKOSISTEM</div>
      <div className="mt-2 grid md:grid-cols-2">
        {tracks.map((track, i) => {
          const Icon = track.icon;
          return <a key={track.name} href="#solusi" className="service-card group flex gap-4 border-b border-white/[.09] py-6 md:pr-8" data-testid={`link-track-${i}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/10 bg-white/[.025] text-[#8bdcff]"><Icon size={17} /></span>
            <span className="flex-1"><span className="flex items-center justify-between"><strong className="text-[14px] font-semibold text-[#e2eaed]">{track.name}</strong><ArrowUpRight size={15} className="text-[#7f929c] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8bdcff]" /></span><span className="mt-1.5 block max-w-[420px] text-[12px] leading-5 text-[#91a0a8]">{track.detail}</span></span>
          </a>;
        })}
      </div>
      </div>
    </div>
  </section>;
}

function Insights() {
  const items = [
    { type: 'PANDUAN', title: 'Hal yang perlu disiapkan sebelum menerima pekerjaan konstruksi pertama', meta: 'Bisnis kontraktor · 6 menit baca', number: '01' },
    { type: 'CHECKLIST', title: 'Merapikan dokumen usaha sebelum mengikuti proses tender', meta: 'Tender & kepatuhan · 4 menit baca', number: '02' },
    { type: 'PRAKTIK LAPANGAN', title: 'Membuat briefing keselamatan kerja jadi bagian dari rutinitas', meta: 'HSE · 5 menit baca', number: '03' },
  ];
  return <section id="wawasan" className="border-y border-white/[.08] bg-[#17232b] py-20 md:py-24">
    <div className="container-wide">
      <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><div className="eyebrow">WAWASAN UNTUK KERJA SEHARI-HARI</div><h2 className="display-font mt-3 text-4xl font-semibold tracking-[-.06em] text-[#eaf1f3] md:text-5xl">Baca. Pahami. Terapkan.</h2></div>
        <Link href="/news" className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#8bdcff] hover:gap-3" data-testid="link-insights-all">Jelajahi News & intelijen <ArrowRight size={14} /></Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map(item => <Link key={item.number} href="/news" className="group flex min-h-[222px] flex-col border border-white/10 bg-[#111c23] p-5 transition hover:border-[#8bdcff]/45" data-testid={`card-insight-${item.number}`}>
          <div className="flex items-center justify-between"><span className="eyebrow !text-[9px]">{item.type}</span><span className="font-mono text-[10px] text-[#61747e]">{item.number}</span></div>
          <h3 className="mt-8 max-w-[320px] text-[17px] font-semibold leading-[1.35] tracking-[-.02em] text-[#e0e9ec] group-hover:text-[#8bdcff]">{item.title}</h3>
          <div className="mt-auto flex items-center justify-between pt-6 text-[10px] text-[#8c9ba3]"><span>{item.meta}</span><ArrowUpRight size={14} className="text-[#8bdcff]" /></div>
        </Link>)}
      </div>
      <p className="mt-4 text-[10px] text-[#73838b]">Contoh topik pengetahuan yang dapat dijelajahi di portal. Materi spesifik mengikuti ketersediaan konten.</p>
    </div>
  </section>;
}

function StartBlock() {
  return <section id="mulai" className="relative overflow-hidden bg-[#8bdcff] py-16 text-[#0c1a22] md:py-[84px]">
    <div className="absolute -right-20 -top-40 h-[480px] w-[480px] rounded-full border border-[#173543]/10" /><div className="absolute -right-4 -top-24 h-[340px] w-[340px] rounded-full border border-[#173543]/10" />
    <div className="container-wide relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div><div className="eyebrow !text-[#215c73]">LANGKAH BERIKUTNYA DIMULAI DI SINI</div><h2 className="display-font mt-4 max-w-[720px] text-[clamp(2.8rem,5.5vw,5rem)] font-semibold leading-[.98]">Apa yang ingin Anda<br />bereskan hari ini?</h2><p className="mt-4 max-w-[480px] text-[14px] leading-6 text-[#234e5c]">Pilih kebutuhan, telusuri sumber yang tersedia, dan temukan arah yang terasa masuk akal untuk pekerjaan Anda.</p></div>
      <a href="#solusi" className="inline-flex w-fit items-center gap-3 rounded-md bg-[#101c23] px-5 py-4 text-sm font-semibold text-[#eaf4f7] transition hover:bg-[#1c333f]" data-testid="link-cta-find-solution">Cari jalur solusi <ArrowRight size={16} /></a>
    </div>
  </section>;
}

function Footer() {
  return <footer className="bg-[#0b1217]">
    <div className="container-wide grid gap-10 py-12 md:grid-cols-[1.1fr_.9fr] md:py-16">
      <div><Brand light /><p className="mt-4 max-w-[365px] text-[12px] leading-6 text-[#91a0a8]">Ekosistem digital untuk membantu bisnis dan profesional konstruksi Indonesia menemukan pengetahuan, alat, dan dukungan yang relevan.</p></div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div><div className="eyebrow !text-[9px]">JELAJAHI</div><a href="#solusi" className="mt-4 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-solusi">Peta solusi</a><a href="#wawasan" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-wawasan">Wawasan</a></div>
        <div><div className="eyebrow !text-[9px]">EKOSISTEM</div><a href="#tentang" className="mt-4 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-ekosistem">Tentang portal</a><a href="#model-bisnis" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-model-bisnis">Arah model bisnis</a><a href="#cara-kerja" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-cara-kerja">Cara kerja</a></div>
        <div className="col-span-2 sm:col-span-1"><div className="eyebrow !text-[9px]">UNTUK SIAPA</div><p className="mt-4 text-[12px] leading-5 text-[#a9b6bd]">Kontraktor UMKM<br />Konsultan konstruksi<br />Tenaga ahli & profesional</p></div>
      </div>
    </div>
    <div className="container-wide flex flex-col justify-between gap-3 border-t border-white/[.08] py-4 text-[10px] text-[#71818a] sm:flex-row"><span>© KontraktorAI · Ekosistem konstruksi Indonesia</span><span>Konten informatif, bukan pengganti nasihat profesional.</span></div>
  </footer>;
}

function Home() {
  return <main className="site-shell noise min-h-[100dvh] bg-[#111a20] text-[#edf3f5]">
    <Header />
    <Hero />
    <div className="container-wide grid grid-cols-2 border-b border-white/[.08] py-6 md:grid-cols-4">
      {[['01', 'Arahan & konsultasi'], ['02', 'Alat yang membantu'], ['03', 'Pengetahuan terapan'], ['04', 'Kolaborasi terbuka']].map(([number, label]) => <div key={number} className="flex items-center gap-3 py-2"><span className="font-mono text-[10px] text-[#7acbe9]">{number}</span><span className="text-[11px] text-[#a7b4bc]">{label}</span></div>)}
    </div>
    <SolutionCatalog />
    <HowItWorks />
    <BusinessModel />
    <Ecosystem />
    <Insights />
    <StartBlock />
    <Footer />
  </main>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route path="/news" component={NewsLanding} /><Route path="/news/:slug" component={NewsArticle} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
