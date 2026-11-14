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
  Layers3, PackageOpen, Workflow, Code2, PlugZap, Route as RouteIcon, CircleDollarSign, Blocks,
  UserRound, Bot, CalendarDays, ClipboardList,
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
  { title: 'Mulai usaha kontraktor', description: 'Petakan langkah awal, legalitas dasar, dan hal yang perlu disiapkan sebelum mengambil pekerjaan.', category: 'Bisnis & legalitas', label: 'AREA KEBUTUHAN', icon: BriefcaseBusiness, tone: 'blue' },
  { title: 'Menyiapkan dokumen tender', description: 'Kenali alur administrasi tender dan kebutuhan pemeriksaan dokumen yang relevan.', category: 'Tender & kepatuhan', label: 'TOPIK TENDER', icon: FileCheck2, tone: 'amber' },
  { title: 'Mengelola proyek harian', description: 'Jelajahi kebutuhan seputar jadwal, catatan lapangan, dan pemantauan progres pekerjaan.', category: 'Manajemen proyek', label: 'AREA PROYEK', icon: ClipboardCheck, tone: 'mint' },
  { title: 'Menghitung kebutuhan biaya', description: 'Petakan kebutuhan estimasi awal pekerjaan dengan asumsi yang dapat ditinjau kembali.', category: 'Alat digital', label: 'TOPIK ESTIMASI', icon: Calculator, tone: 'violet' },
  { title: 'Meningkatkan kompetensi tim', description: 'Petakan materi belajar dan arah pengembangan keterampilan untuk peran konstruksi.', category: 'Akademi & kompetensi', label: 'AREA KOMPETENSI', icon: GraduationCap, tone: 'blue' },
  { title: 'Menata keselamatan kerja', description: 'Pertimbangkan kebutuhan praktik HSE, pengingat, dan langkah kerja yang sadar risiko.', category: 'HSE & keberlanjutan', label: 'AREA KESELAMATAN', icon: ShieldCheck, tone: 'amber' },
  { title: 'Mencari rekan kolaborasi', description: 'Petakan peluang memperluas jaringan profesional dan kerja sama yang relevan.', category: 'Kolaborasi', label: 'AREA KOLABORASI', icon: UsersRound, tone: 'mint' },
  { title: 'Bertanya pada ahli', description: 'Tentukan persoalan dan konteks sebelum mempertimbangkan dukungan konsultan atau tenaga ahli.', category: 'AI & konsultasi', label: 'AREA KEAHLIAN', icon: MessagesSquare, tone: 'violet' },
  { title: 'Memahami solusi industri', description: 'Jelajahi tantangan dan pendekatan yang mungkin relevan untuk kebutuhan konstruksi.', category: 'Solusi industri', label: 'AREA INDUSTRI', icon: HardHat, tone: 'blue' },
];

const categories = ['Semua solusi', 'AI & konsultasi', 'Kolaborasi', 'Alat digital', 'Manajemen proyek', 'Tender & kepatuhan', 'HSE & keberlanjutan', 'Akademi & kompetensi', 'Bisnis & legalitas', 'Solusi industri'];

function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" data-testid="link-brand-home" className={`brand-lockup ${light ? 'text-[#e9f3f7]' : ''}`}>
    <span className="brand-mark"><span /><span /><span /></span>
    <span className="flex flex-col leading-none">
      <span className="font-semibold tracking-[-.04em]">Kontraktor<span className="text-[#8bdcff]">AI</span></span>
      <span className="mt-1.5 font-mono text-[8px] tracking-[.13em] text-[#9aabb4]">BY GUSTAFTA</span>
    </span>
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
        <div className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-8 bg-[#8bdcff]" />GUSTAFTA · BRAND INDUK <span className="text-[#70848e]">/</span> KONTRAKTORAI · VERTIKAL INDUSTRI</div>
        <h1 className="display-font max-w-[730px] text-[clamp(3.3rem,7.2vw,6.65rem)] font-semibold leading-[.98] text-[#edf3f5]">
          Industri konstruksi<br />bergerak lebih jauh<br /><span className="text-[#8bdcff]">bersama.</span>
        </h1>
        <p className="mt-7 max-w-[510px] text-[16px] leading-7 text-[#a8b6c0] md:text-[17px]">KontraktorAI adalah portal solusi digital dan AI untuk UMKM kontraktor serta profesional industri Indonesia. Sebagai brand industri Gustafta, kami berangkat dari kebutuhan nyata—bukan teknologi semata.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <a href="#solusi" className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-3.5 text-sm font-semibold" data-testid="link-hero-explore">Jelajahi solusi <ArrowRight size={16} /></a>
          <a href="#cara-kerja" className="btn-outline inline-flex items-center gap-2 rounded-md px-5 py-3.5 text-sm font-medium" data-testid="link-hero-how">Lihat cara kerja <ArrowDown size={15} /></a>
        </div>
        <div className="mt-12 flex items-center gap-4 text-[12px] text-[#8d9aa4]">
          <span className="flex -space-x-2">
            {['UK','KM','AH'].map((item, i) => <span key={item} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[#111a20] text-[9px] font-semibold ${i === 0 ? 'bg-[#c7e5eb] text-[#17313b]' : i === 1 ? 'bg-[#b2c8e2] text-[#202c42]' : 'bg-[#d9c7a9] text-[#34291b]'}`} data-testid={`avatar-persona-${i}`}>{item}</span>)}
          </span>
           <span>UMKM sebagai pasar utama Gustafta · profesional sebagai bagian ekosistem</span>
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
       <span className="font-mono tracking-[.1em]">GUSTAFTA · PASAR UMKM</span><a href="#solusi" className="inline-flex items-center gap-2 text-[#aebbc3] hover:text-[#8bdcff]" data-testid="link-hero-scroll">Lihat jalur eksplorasi <ArrowDown size={13} /></a>
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
        <div><div className="eyebrow !text-[#347890]">PETA KEBUTUHAN · TAKSONOMI STRATEGIS</div><h2 className="display-font mt-4 text-[clamp(2.8rem,5.2vw,4.7rem)] font-semibold leading-[.98]">Masalah Anda,<br />mulai dari sini.</h2></div>
        <div className="max-w-[550px] pb-1 md:justify-self-end"><p className="text-[15px] leading-7 text-[#52636d]">Mulai dari hasil yang ingin dicapai, bukan nama teknologinya. Topik berikut memetakan kebutuhan yang akan divalidasi—bukan daftar layanan atau produk yang diklaim sudah tersedia.</p></div>
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
      <p className="mt-5 flex items-center gap-2 text-[10px] text-[#788991]" data-testid="text-catalog-strategy-note"><Check size={13} className="text-[#42869d]" /> Peta kebutuhan strategis, bukan penawaran yang tersedia atau pengganti konsultasi profesional.</p>
    </div>
  </section>;
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Validasi masalah nyata', description: 'Dengarkan konteks UMKM dan profesional; pastikan persoalannya penting dan cukup spesifik.', icon: Compass },
    { number: '02', title: 'Uji solusi yang relevan', description: 'Rancang pendekatan untuk hasil kerja yang dibutuhkan, tanpa mengasumsikan AI selalu menjadi jawabannya.', icon: Search },
    { number: '03', title: 'Validasi kesediaan membayar', description: 'Uji apakah pihak yang menghadapi masalah bersedia membayar solusi sebelum memperluas investasi.', icon: ShieldCheck },
    { number: '04', title: 'Standarkan yang berulang', description: 'Rapikan metode yang terbukti dapat diulang lintas kebutuhan serupa dengan mutu yang terjaga.', icon: ClipboardCheck },
    { number: '05', title: 'Produkkan secara bertahap', description: 'Baru setelah validasi dan standardisasi, pertimbangkan bentuk produk digital atau SaaS.', icon: Layers3 },
  ];
  return <section id="cara-kerja" className="relative border-b border-white/[.08] bg-[#121c23] py-20 md:py-28">
    <div className="container-wide">
      <div className="grid gap-10 md:grid-cols-[.82fr_1.18fr]">
        <div><div className="eyebrow">DISIPLIN PART 03 · VALIDASI SEBELUM PRODUK</div><h2 className="display-font mt-4 max-w-[430px] text-[clamp(2.6rem,4.5vw,4rem)] font-semibold leading-[1.02]">Dari persoalan,<br /><span className="text-[#8bdcff]">ke solusi teruji.</span></h2><p className="mt-5 max-w-[400px] text-[14px] leading-7 text-[#9baab2]">Nilai hadir saat pekerjaan pelanggan menjadi lebih baik. Teknologi adalah salah satu cara; hasil yang relevan adalah ukurannya.</p>
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
    { no: '01', title: 'Digital Development', text: 'Pengembangan digital untuk kebutuhan proses, data, dan cara kerja.', icon: Layers3 },
    { no: '02', title: 'SaaS & AI Products', text: 'Produk perangkat lunak dan AI yang dibentuk dari kebutuhan tervalidasi.', icon: Sparkles },
    { no: '03', title: 'Consulting & Advisory', text: 'Pendampingan untuk membantu organisasi menentukan dan menjalankan langkah.', icon: Compass },
    { no: '04', title: 'Knowledge & Academy', text: 'Pengetahuan terapan dan pengembangan kompetensi bagi pelaku usaha.', icon: BookOpen },
    { no: '05', title: 'Business Collaboration', text: 'Kolaborasi yang mempertemukan kebutuhan, keahlian, dan peluang.', icon: UsersRound },
    { no: '06', title: 'Industry Solutions', text: 'Solusi spesifik untuk tantangan pada sektor industri prioritas.', icon: HardHat },
  ];
  const productLevels = [
    { no: '01', title: 'Entry Products', text: 'Kebutuhan awal dengan ruang lingkup ringkas dan proses implementasi sederhana.' },
    { no: '02', title: 'Business Solutions', text: 'Kebutuhan proses atau operasional yang memerlukan solusi lebih menyeluruh.' },
    { no: '03', title: 'Recurring Products', text: 'Produk berulang yang dipertimbangkan setelah kebutuhan dan penggunaan terbukti.' },
  ];
  const phases = [
    { id: '01', title: 'Arus kas tahun pertama: layanan', items: 'Jasa dan pendampingan berbasis kebutuhan yang tervalidasi', note: 'Pendekatan awal untuk melayani kebutuhan pelanggan sekaligus belajar langsung; bukan klaim ketersediaan penawaran tertentu.' },
    { id: '02', title: 'Bangun SaaS secara bertahap', items: 'Produk digital dan SaaS setelah pola solusi berulang terlihat', note: 'Dikembangkan seiring validasi masalah, solusi, kesediaan membayar, dan kesiapan standardisasi.' },
  ];
  const portfolio = [
    { id: '01', title: 'Professional services', text: 'Layanan profesional dan pendampingan untuk memahami konteks, merancang pendekatan, dan membantu perubahan kerja.', icon: BriefcaseBusiness },
    { id: '02', title: 'Productized services', text: 'Metode layanan yang ruang lingkup dan alurnya dapat distandarkan ketika kebutuhan serupa mulai berulang.', icon: Workflow },
    { id: '03', title: 'Digital products', text: 'Aset dan perangkat digital yang dapat membantu pekerjaan spesifik; bentuk dan prioritasnya perlu diuji.', icon: PackageOpen },
    { id: '04', title: 'SaaS & AI products', text: 'Produk berulang yang dipertimbangkan setelah masalah, penggunaan, dan model operasinya tervalidasi.', icon: Blocks },
  ];
  const opportunities = [
    { priority: 'P0', title: 'Validasi awal', items: ['Website / landing pages', 'Setup asisten bisnis AI', 'Otomasi bisnis'] },
    { priority: 'P1', title: 'Kebutuhan berulang', items: ['Pemeliharaan website', 'Dashboard bisnis', 'Template digital', 'Layanan pelanggan AI'] },
    { priority: 'P2', title: 'Pengetahuan terapan', items: ['Asisten dokumen AI', 'Asisten pengetahuan industri'] },
    { priority: 'P3', title: 'Peluang industri', items: ['SaaS industri'] },
  ];
  const revenueStreams = [
    { title: 'Proyek', detail: 'Pendapatan implementasi website, aplikasi, otomasi, dan solusi digital yang kebutuhan serta ruang lingkupnya telah dipetakan.' },
    { title: 'Konsultasi', detail: 'Pendampingan profesional untuk analisis kebutuhan dan perencanaan transformasi digital.' },
    { title: 'Subscription & managed service', detail: 'Model berulang untuk dukungan atau produk setelah manfaat dan kebutuhan operasional tervalidasi.' },
    { title: 'Lisensi', detail: 'Lisensi penggunaan produk digital atau perangkat lunak dengan hak dan batasan yang jelas.' },
    { title: 'Produk digital', detail: 'Potensi transaksi dari aset digital yang relevansi dan kebutuhan pelanggannya telah diuji.' },
    { title: 'Kemitraan & integrasi', detail: 'Pendapatan dari implementasi, distribusi, integrasi, atau pengembangan bersama mitra.' },
  ];
  const operatingFunctions = [
    'Business development & marketing',
    'Product & technology',
    'Project & service delivery',
    'Finance & administration',
    'Knowledge & innovation',
  ];
  const operatingSops = [
    'Lead management', 'Konsultasi pelanggan', 'Proposal & quotation',
    'Manajemen proyek', 'Delivery proyek', 'Quality assurance',
    'Invoice & pembayaran', 'Customer support', 'Backup & keamanan data',
    'Rilis produk',
  ];
  const operatingPhases = [
    { period: 'Bulan 1–3', title: 'Foundation', detail: 'SOP, penjualan, delivery, keuangan, dan dokumentasi dasar.' },
    { period: 'Bulan 4–6', title: 'Kolaborasi eksternal', detail: 'Libatkan freelancer dan mitra sesuai kebutuhan proyek.' },
    { period: 'Bulan 7–9', title: 'Optimasi', detail: 'Otomasi, standardisasi layanan, dan perbaikan sistem kerja.' },
    { period: 'Bulan 10–12', title: 'Evaluasi kapasitas', detail: 'Tinjau kebutuhan kolaborator berdasarkan beban kerja dan cashflow.' },
  ];
  const canvasBlocks = [
    { title: 'Segmen pelanggan', detail: 'UMKM sebagai pasar utama Gustafta; KontraktorAI fokus pada kebutuhan konstruksi lebih dulu, lalu sektor industri lain bertahap.' },
    { title: 'Proposisi nilai', detail: 'Penerapan AI dan digitalisasi yang praktis, relevan dengan proses kerja, serta didukung kolaborasi dan pengetahuan.' },
    { title: 'Saluran', detail: 'Portal, kanal digital, edukasi, komunitas, penjualan langsung, dan mitra merupakan jalur yang direncanakan untuk diuji.' },
    { title: 'Hubungan pelanggan', detail: 'Konsultatif, berbasis proyek, retainer, subscription, serta komunitas dan edukasi sesuai kesiapan penawaran.' },
    { title: 'Sumber pendapatan', detail: 'Jasa konsultasi dan implementasi lebih dahulu; retainer, maintenance, produk digital, subscription, pelatihan, dan kemitraan menyusul setelah validasi.' },
    { title: 'Aktivitas utama', detail: 'Pengembangan bisnis, konsultasi, implementasi AI, integrasi teknologi, pengembangan produk, konten, dukungan, dan dokumentasi.' },
    { title: 'Sumber daya', detail: 'Founder, brand Gustafta dan KontraktorAI, keahlian, perangkat digital, infrastruktur, aset pengetahuan, pelanggan, serta spesialis eksternal.' },
    { title: 'Mitra utama', detail: 'Penyedia AI, cloud dan software, freelancer, konsultan teknis, profesional industri, komunitas UMKM, dan mitra bisnis.' },
    { title: 'Struktur biaya', detail: 'Langganan teknologi, API/cloud, biaya proyek, pemasaran, spesialis eksternal, pengembangan produk, administrasi, dan kepatuhan.' },
  ];
  const financialHorizons = [
    { number: '01', title: 'Cashflow dari jasa', detail: 'Proyek, konsultasi, implementasi, dan integrasi dengan ruang lingkup serta pembayaran yang jelas.' },
    { number: '02', title: 'Pendapatan berulang', detail: 'Maintenance, retainer, managed service, atau subscription setelah kapasitas support dan biaya terukur.' },
    { number: '03', title: 'Aset digital', detail: 'Template, workflow, dan SaaS dikembangkan bertahap setelah kebutuhan dan minat berbayar divalidasi.' },
  ];
  const prioritizedServices = [
    { role: 'PINTU MASUK', title: 'AI & Digital Consulting', detail: 'Discovery, assessment, dan konsultasi untuk memahami kebutuhan sebelum merancang solusi.', model: 'Per sesi · assessment · proyek' },
    { role: 'MESIN CASHFLOW', title: 'Digital Foundation', detail: 'Website, landing page, atau fondasi digital dengan ruang lingkup yang disepakati.', model: 'Proyek · opsi maintenance' },
    { role: 'MESIN CASHFLOW', title: 'Business Automation', detail: 'Pemetaan dan otomasi proses berulang dengan biaya dan deliverable yang terukur.', model: 'Implementasi · maintenance' },
    { role: 'PEMBEDA', title: 'AI Implementation', detail: 'Penerapan chatbot, assistant, dokumen, atau workflow AI setelah kesesuaian kebutuhan dinilai.', model: 'Setup · dukungan berulang' },
    { role: 'RECURRING', title: 'Managed Technology Services', detail: 'Maintenance, pemantauan, dukungan, atau perbaikan minor dengan batas layanan yang jelas.', model: 'Retainer · bulanan' },
    { role: 'SPESIALIS INDUSTRI', title: 'Solusi KontraktorAI', detail: 'Discovery industri dan pilot berscope; fokus pasar masuk bertahap, bukan asumsi proyek siap jual.', model: 'Assessment · pilot sesuai scope' },
  ];
  const bootstrapRules = [
    'Utamakan sumber daya dan perangkat yang sudah tersedia; tinjau langganan rutin.',
    'Hindari biaya tetap baru sebelum ada kebutuhan dan sumber dana yang jelas.',
    'Gunakan uang muka atau pembayaran bertahap sesuai ruang lingkup dan kontrak.',
    'Libatkan spesialis eksternal bila biayanya tercakup dalam pekerjaan atau anggaran.',
    'Catat pemasukan, pengeluaran, piutang, biaya proyek, dan kas bisnis terpisah.',
    'Tinjau arus kas bergulir dan komitmen biaya secara rutin.',
  ];
  const unitEconomics = [
    { title: 'Laba kotor proyek', formula: 'Pendapatan proyek − biaya langsung' },
    { title: 'Margin kotor', formula: 'Laba kotor ÷ pendapatan × 100%' },
    { title: 'MRR', formula: 'Pelanggan aktif × pendapatan bulanan rata-rata' },
    { title: 'CAC', formula: 'Biaya akuisisi ÷ pelanggan baru' },
    { title: 'LTV', formula: 'Laba kotor bulanan per pelanggan × masa aktif rata-rata' },
    { title: 'Titik impas', formula: 'Biaya tetap ÷ rasio margin kontribusi' },
  ];
  const financePhases = [
    { period: 'Bulan 1–3', title: 'Bangun arus kas', detail: 'Uji penawaran jasa, catat biaya, dan ketahui margin proyek.' },
    { period: 'Bulan 4–6', title: 'Stabilkan pendapatan', detail: 'Rapikan layanan dan uji maintenance atau retainer.' },
    { period: 'Bulan 7–9', title: 'Uji pendapatan berulang', detail: 'Validasi produk digital atau subscription secara terbatas.' },
    { period: 'Bulan 10–12', title: 'Optimalkan keuangan', detail: 'Tinjau margin, retensi, portofolio, dan kapasitas.' },
  ];
  const digitalProductCandidates = [
    { number: '01', status: 'PRIORITAS PERTAMA', title: 'KontraktorAI Productivity Toolkit', detail: 'Kandidat produk digital awal: prompt AI, template BOQ/RAB, laporan proyek, SOP, dokumen, dan panduan workflow.', model: 'Pembelian sekali · bundle · implementasi' },
    { number: '02', status: 'BERDASARKAN MASUKAN PENGGUNA', title: 'KontraktorAI Document & Reporting Kit', detail: 'Template dokumentasi dan laporan proyek, checklist, serta alur ringkasan dokumen yang dibentuk dari kebutuhan pengguna.', model: 'Produk digital · implementasi' },
    { number: '03', status: 'KANDIDAT LANJUTAN', title: 'KontraktorAI Automation Toolkit', detail: 'Paket workflow untuk laporan, dokumen, notifikasi, dan integrasi spreadsheet atau database setelah pola berulang terbukti.', model: 'Produk digital · implementasi' },
  ];
  const saasCoreFeatures = [
    'Manajemen dokumen proyek',
    'AI document assistant',
    'Pembuatan laporan',
  ];
  const productGrowthStages = [
    { title: 'Validasi & toolkit', detail: 'Temukan masalah konstruksi yang berulang dan uji produk pertama dengan pengguna.' },
    { title: 'Produk digital lanjutan', detail: 'Kembangkan toolkit dokumentasi atau otomasi dari bukti penggunaan, bukan asumsi.' },
    { title: 'SaaS MVP', detail: 'Uji tiga fungsi inti dengan pilot; tambah akun, workspace, dan fungsi lain sesuai kebutuhan.' },
    { title: 'Komersialisasi bertahap', detail: 'Tinjau penggunaan, biaya AI/infrastruktur, dukungan, dan retensi sebelum memperluas.' },
  ];
  const saasGovernance = [
    'Integrasikan layanan umum lebih dulu; bangun komponen inti sendiri saat kebutuhan dan nilai pembeda terbukti.',
    'Jaga kendali atas data, logika bisnis, aset produk, dan jalur ekspor agar tidak terkunci pada vendor.',
    'Siapkan autentikasi, akses berbasis peran, logging, backup, pembatasan penggunaan API, dan pemulihan.',
    'Uji kualitas AI dan sumber jawaban; minta tinjauan ahli untuk keputusan teknis atau keselamatan yang kritis.',
    'Nama platform dan vendor pada blueprint adalah kandidat, bukan keputusan langganan atau implementasi.',
  ];
  const marketplacePillars = [
    { title: 'Experts Network', detail: 'Jaringan ahli independen; status terdaftar, terverifikasi, premium, dan mitra strategis harus dibedakan.' },
    { title: 'Company Network', detail: 'Profil perusahaan dan kebutuhan kolaborasi; kelayakan dan dokumen diperiksa sesuai risiko.' },
    { title: 'Project Hub', detail: 'Penyaringan kebutuhan, pencocokan penyedia, proposal, kesepakatan, koordinasi, dan evaluasi.' },
    { title: 'Tender Hub', detail: 'Informasi bersumber resmi dengan tanggal pemeriksaan, tenggat, kriteria, dan tautan sumber.' },
    { title: 'Partnership Hub', detail: 'Kolaborasi referral, berbasis proyek, dan strategis dengan peran serta pembagian kerja tertulis.' },
    { title: 'Transaction Hub', detail: 'Permintaan, penawaran, kesepakatan, pembayaran, delivery, penyelesaian, dan review.' },
  ];
  const marketplaceStages = [
    { title: 'Managed marketplace', label: 'AWAL · MANUAL', detail: 'Founder mengelola database, verifikasi, matching, komunikasi, dokumen, dan pencatatan transaksi.' },
    { title: 'Digital marketplace', label: 'SETELAH VALIDASI', detail: 'Registrasi mandiri, direktori, listing peluang, proposal, dan dashboard ketika aktivitas membenarkannya.' },
    { title: 'Intelligent marketplace', label: 'JANGKA PANJANG', detail: 'AI matching dan intelijen tender setelah data, tata kelola, dan volume interaksi memadai.' },
  ];
  const marketplaceRevenue = [
    { title: 'Consulting', detail: 'Pendapatan jasa langsung untuk konsultasi bisnis, teknologi, tender, dan kebutuhan industri.' },
    { title: 'Facilitation', detail: 'Biaya matching, koordinasi, atau success fee sesuai kontribusi dan kesepakatan tertulis.' },
    { title: 'Commission', detail: 'Komisi transaksi setelah sumber nilai, dasar hitung, dan tanggung jawab transparan.' },
    { title: 'Membership', detail: 'Basic gratis; fitur premium berbayar hanya setelah manfaat dan dukungan siap diuji.' },
  ];
  const marketplaceSafeguards = [
    'Verifikasi ahli dan perusahaan berdasarkan bukti; biaya keanggotaan tidak membeli status terverifikasi.',
    'Data identitas, kredensial, tender, kontrak, dan dokumen proyek dibatasi sesuai persetujuan dan hak akses.',
    'Cantumkan sumber dan tanggal pemeriksaan peluang; jangan menyajikan tender lama sebagai peluang terbuka atau menjanjikan kemenangan.',
    'Ungkap biaya, komisi, peran, konflik kepentingan, dan penanganan sengketa secara tertulis.',
    'Gunakan penyedia pembayaran yang sesuai aturan; jangan menahan dana pihak ketiga sendiri tanpa dasar dan kepatuhan yang sesuai.',
  ];
  const academyPillars = [
    { title: 'Training & Academy', detail: 'Kursus, workshop, dan program pelatihan untuk kebutuhan industri dan bisnis.' },
    { title: 'LMS & Digital Learning', detail: 'Materi digital, kuis, progres belajar, dan subscription secara bertahap.' },
    { title: 'Competency & Certification', detail: 'Evaluasi program Gustafta serta kemitraan sertifikasi eksternal yang berwenang.' },
    { title: 'Professional Services', detail: 'Konsultasi, mentoring, dan pendampingan profesional untuk individu dan organisasi.' },
  ];
  const academyProgramTracks = [
    { title: 'Industri & teknis', detail: 'Konstruksi, energi, kelistrikan, pertambangan, dan lingkungan secara bertahap.' },
    { title: 'AI & digital', detail: 'Produktivitas AI, otomasi, data, dan transformasi digital.' },
    { title: 'Bisnis & profesional', detail: 'Manajemen bisnis dan proyek, leadership, serta keterampilan profesional.' },
  ];
  const lmsStages = [
    { title: 'Platform siap pakai', detail: 'Mulai dengan katalog, materi, kuis, peserta, dan progres belajar.' },
    { title: 'Integrasi', detail: 'Hubungkan website, akun, CRM, pembayaran, sertifikat, dan data peserta sesuai kesiapan.' },
    { title: 'Pengembangan khusus', detail: 'Bangun fitur sendiri bila skala peserta dan kebutuhan berulang membenarkan investasi.' },
  ];
  const academyRevenue = [
    { title: 'Kursus & pelatihan', detail: 'Kelas dan workshop berbayar menjadi jalur komersial awal.' },
    { title: 'Corporate training', detail: 'Program pengembangan kapasitas yang disesuaikan untuk perusahaan.' },
    { title: 'Konsultasi profesional', detail: 'Analisis, rekomendasi, mentoring, dan pendampingan.' },
    { title: 'LMS subscription', detail: 'Dikembangkan seiring pertumbuhan katalog dan peserta.' },
    { title: 'Sertifikasi', detail: 'Persiapan dan kemitraan eksternal sesuai kewenangan.' },
  ];
  const technologyDecisions = [
    { title: 'Hybrid cloud', detail: 'Utamakan layanan cloud terkelola; tambah infrastruktur khusus bila kebutuhan dan biaya membenarkannya.' },
    { title: 'Hybrid database', detail: 'Gunakan fondasi data utama bersama; pisahkan database aplikasi jika perlu dengan standar konsistensi yang jelas.' },
    { title: 'Hybrid development', detail: 'Pilih no-code, low-code, atau custom berdasarkan kompleksitas, nilai, dan kemampuan pemeliharaan.' },
    { title: 'Hybrid integration', detail: 'Mulai dari konektor dan otomasi; tingkatkan API, webhook, dan integration layer saat sistem bertambah.' },
    { title: 'Centralized identity', detail: 'Satukan identitas dan akses secara bertahap; terapkan SSO saat kebutuhan dan kesiapan teknis mendukung.' },
    { title: 'Risk-based security', detail: 'Prioritaskan kontrol berdasarkan klasifikasi data dan kekritisan layanan, terutama akun admin dan transaksi.' },
    { title: 'Data governance first', detail: 'Tata kualitas, kepemilikan, klasifikasi, dan perlindungan sebelum memperluas analitik atau penggunaan AI.' },
    { title: 'Founder-led hybrid management', detail: 'Founder memegang arah; vendor, konsultan, freelancer, dan spesialis mendukung sesuai kebutuhan.' },
  ];
  const technologySafeguards = [
    'Terapkan role dan pembatasan akses sesuai organisasi, kepemilikan, proyek, serta kebutuhan tugas; lindungi akun administrator dengan MFA.',
    'Klasifikasikan data, tetapkan sumber data utama per domain, minimalkan pengumpulan, dan batasi retensi serta penggunaan lintas pelanggan.',
    'Kelola kredensial di secret manager, pisahkan development/staging/production, dan catat perubahan penting.',
    'Amankan integrasi dan penggunaan AI: batasi data yang dikirim, ruang lingkup izin, biaya API, serta tindakan otomatis berisiko.',
    'Sediakan backup berkala, uji pemulihan, pencatatan insiden, dan prosedur kesinambungan sesuai tingkat kritikalitas.',
    'Nilai biaya, lokasi pemrosesan, lisensi, privasi, portabilitas, dan rencana keluar sebelum memilih vendor.',
  ];
  const growthDecisions = [
    { title: 'Hybrid ecosystem positioning', detail: 'Pasarkan Gustafta sebagai ekosistem bisnis, teknologi, industri, dan kolaborasi.' },
    { title: 'Hybrid marketing channels', detail: 'Satukan website, SEO, media sosial, WhatsApp, email, direct selling, dan partnership.' },
    { title: 'Hybrid SEO & content', detail: 'Bangun visibilitas organik jangka panjang dan distribusikan materi lintas kanal.' },
    { title: 'Hybrid news & editorial', detail: 'Gabungkan kurasi terverifikasi, ringkasan, analisis, dan editorial original.' },
    { title: 'Hybrid community ecosystem', detail: 'Bangun ruang komunitas untuk interaksi, berbagi pengetahuan, dan kolaborasi profesional.' },
    { title: 'Hybrid customer acquisition', detail: 'Gabungkan jalur organik, referral, kemitraan, penjualan langsung, dan kanal berbayar secara terukur.' },
    { title: 'Hybrid partnership & distribution', detail: 'Gabungkan mitra teknologi, industri, pengetahuan, referral, proyek, dan kemitraan strategis.' },
    { title: 'Cashflow & service acquisition first', detail: 'Prioritaskan pendapatan jasa/proyek sebelum ekspansi audiens atau platform secara agresif.' },
  ];
  const growthPhases = [
    { period: 'BULAN 1–3', title: 'Fondasi & penjualan awal', detail: 'Website, positioning, penawaran jasa, dan pelanggan awal.' },
    { period: 'BULAN 4–6', title: 'Validasi pasar', detail: 'Proyek, studi kasus, SEO, prospek, dan produk awal.' },
    { period: 'BULAN 7–9', title: 'Pertumbuhan & distribusi', detail: 'Partnership, komunitas, dan pendapatan berulang.' },
    { period: 'BULAN 10–12', title: 'Optimasi', detail: 'Tingkatkan pendapatan, retensi, dan produk digital sesuai kapasitas.' },
  ];
  const growthEditorialRules = [
    'Cantumkan sumber asli, tautan, dan tanggal; periksa apakah informasi masih berlaku.',
    'Pisahkan fakta dari opini dan transparan bila AI membantu penyusunan.',
    'Jangan menyalin artikel eksternal secara utuh; lakukan pemeriksaan kualitas sebelum publikasi.',
    'Ukur konten dari prospek dan hasil bisnis, bukan trafik atau jumlah pengikut saja.',
  ];
  const executionPhases = [
    { period: 'BULAN 1–3', title: 'Foundation · Build & Sell', detail: 'Satukan backlog, audit aset, siapkan SOP dan penawaran, lalu utamakan pelanggan serta proyek awal.' },
    { period: 'BULAN 4–6', title: 'Validation · Deliver', detail: 'Validasi layanan dan kebutuhan produk; dokumentasikan proyek, studi kasus, biaya, dan proses delivery.' },
    { period: 'BULAN 7–9', title: 'Growth · Integrate', detail: 'Perluas yang tervalidasi melalui integrasi, distribusi, kemitraan, dan uji pendapatan berulang.' },
    { period: 'BULAN 10–12', title: 'Optimization · Focus', detail: 'Tinjau portfolio; optimalkan yang bernilai, tunda yang belum terbukti, dan siapkan roadmap berikutnya.' },
  ];
  const priorityCriteria = [
    'Potensi pendapatan',
    'Kebutuhan dan urgensi pasar',
    'Kesesuaian strategi',
    'Kecepatan menuju hasil',
    'Kesiapan teknologi',
    'Potensi pendapatan berulang',
    'Efisiensi waktu dan sumber daya',
  ];
  const executionReviews = [
    { title: 'Mingguan', detail: 'Progres, hambatan, anggaran, peluang pendapatan, dan tiga prioritas berikutnya.' },
    { title: 'Bulanan', detail: 'Revenue, cashflow, margin proyek, pipeline, marketing, produk, dan beban founder.' },
    { title: 'Kuartalan', detail: 'Portfolio, anggaran, risiko, OKR, serta keputusan continue, improve, hold, atau stop.' },
  ];
  const newsCmsDecisions = [
    { number: '01', title: 'Kurasi berita', detail: 'RSS/API, bantuan AI untuk kurasi dan draf, serta input manual terintegrasi.' },
    { number: '02', title: 'Model CMS', detail: 'Hybrid CMS: mulai dari platform siap pakai, lalu tambahkan modul khusus bertahap.' },
    { number: '03', title: 'Kebijakan publikasi', detail: 'Artikel rutin dijadwalkan setelah review; konten sensitif memerlukan persetujuan khusus.' },
    { number: '04', title: 'Cakupan konten', detail: 'Berita, proyek, teknologi, regulasi, analisis, dan pengetahuan industri.' },
    { number: '05', title: 'Distribusi bertahap', detail: 'Website dan SEO, lalu kanal sosial/WhatsApp serta newsletter dan CRM.' },
    { number: '06', title: 'Monetisasi awal', detail: 'Utamakan prospek berkualitas untuk layanan Gustafta; bukan iklan sebagai pendapatan utama.' },
  ];
  const newsMvpPhases = [
    { period: 'MINGGU 1–2', title: 'Fondasi & setup WordPress', detail: 'Finalisasi sitemap, model data, peran, aktivasi situs, dan uji feed publik baca-saja.' },
    { period: 'MINGGU 3–4', title: 'Website & CMS inti', detail: 'Template News, kategori, artikel, Article Manager, media, SEO, dan peran.' },
    { period: 'MINGGU 5–6', title: 'Workflow & AI editorial', detail: 'Source Manager, persetujuan, RSS/sumber yang diizinkan, ringkasan, dan draf AI.' },
    { period: 'MINGGU 7–8', title: 'Integrasi, QA & peluncuran', detail: 'Analytics, prospek, distribusi awal, keamanan, backup, dan pengujian.' },
  ];
  return <section id="model-bisnis" className="relative overflow-hidden border-y border-white/[.08] bg-[#111c23] py-20 md:py-28">
    <div className="absolute right-[-180px] top-[-180px] h-[500px] w-[500px] rounded-full border border-[#8bdcff]/[.08]" />
    <div className="container-wide relative">
      <div className="grid gap-8 border-b border-white/10 pb-9 md:grid-cols-[1fr_.72fr] md:items-end">
      <div><div className="eyebrow">ARAH MODEL BISNIS · BAGIAN 02</div><h2 className="display-font mt-4 max-w-[740px] text-[clamp(2.7rem,5vw,4.8rem)] font-semibold leading-[.98]">Layanan lebih dulu.<br /><span className="text-[#8bdcff]">Produk bertahap.</span></h2></div>
        <p className="max-w-[470px] text-[13px] leading-6 text-[#a4b2ba]">Model hibrida: layanan membantu arus kas tahun pertama sambil kebutuhan divalidasi, lalu SaaS dibangun bertahap. UMKM adalah fokus utama Gustafta; KontraktorAI mendalami UMKM kontraktor dan profesional industri.</p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-l-2 border-[#8bdcff] bg-[#8bdcff]/[.055] px-4 py-3 text-[11px] leading-5 text-[#c4d2d9]" data-testid="status-business-model-recommendation">
        <span className="font-mono text-[9px] tracking-[.12em] text-[#8bdcff]">ARAH DISETUJUI · VALIDASI BERLANJUT</span>
        <span>Model hibrida, fokus UMKM, dan prioritas layanan lebih dulu telah dipilih; harga dan unit economics tetap perlu diuji.</span>
      </div>
      <div className="mt-8 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3" data-testid="business-units">
        {units.map(unit => {
          const Icon = unit.icon;
          return <article key={unit.no} className="group min-h-[166px] bg-[#121e26] p-5 transition-colors hover:bg-[#172832]" data-testid={`business-unit-${unit.no}`}>
            <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[#78c9e8]">{unit.no} / 06</span><Icon size={17} className="text-[#83cfe9]" /></div>
            <h3 className="mt-5 text-[15px] font-semibold tracking-[-.02em] text-[#e5edf0]">{unit.title}</h3>
            <p className="mt-2 max-w-[330px] text-[11px] leading-5 text-[#93a3ac]">{unit.text}</p>
          </article>;
        })}
      </div>
      <div className="mt-12 border-t border-white/10 pt-9" data-testid="portfolio-architecture">
        <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><div className="eyebrow">PART 04 · ARSITEKTUR PORTOFOLIO</div><h3 className="display-font mt-3 max-w-[460px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Empat bentuk nilai.<br /><span className="text-[#8bdcff]">Satu jalur belajar.</span></h3></div>
          <p className="max-w-[560px] text-[12px] leading-6 text-[#9baab2]">Portofolio direncanakan seimbang antara jasa dan produk. Layanan dapat menjadi sumber arus kas tahun pertama sekaligus ruang belajar; produk digital dan SaaS dikembangkan bertahap dari pola kebutuhan yang berulang.</p>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-4">
          {portfolio.map(item => {
            const Icon = item.icon;
            return <article key={item.id} className="min-h-[190px] bg-[#121e26] p-5" data-testid={`portfolio-category-${item.id}`}>
              <div className="flex items-center justify-between"><span className="font-mono text-[10px] text-[#78c9e8]">0{item.id} / 04</span><Icon size={18} className="text-[#8bdcff]" /></div>
              <h4 className="mt-6 text-[14px] font-semibold text-[#e5edf0]">{item.title}</h4>
              <p className="mt-2 text-[11px] leading-5 text-[#91a0a8]">{item.text}</p>
            </article>;
          })}
        </div>
        <div className="mt-4 grid gap-3 border border-[#8bdcff]/20 bg-[#8bdcff]/[.045] p-4 md:grid-cols-2" data-testid="delivery-model">
          <div className="flex gap-3"><Code2 size={17} className="mt-0.5 shrink-0 text-[#8bdcff]" /><p className="text-[11px] leading-5 text-[#c0cdd3]"><strong className="font-semibold text-[#e4eef2]">Pilih cara membangun menurut use case.</strong> No-code, low-code, atau pengembangan khusus dipilih berdasarkan kebutuhan, kompleksitas, dan keberlanjutan solusi.</p></div>
          <div className="flex gap-3"><PlugZap size={17} className="mt-0.5 shrink-0 text-[#8bdcff]" /><p className="text-[11px] leading-5 text-[#c0cdd3]"><strong className="font-semibold text-[#e4eef2]">Rangkai ekosistem yang tepat.</strong> Produk milik Gustafta dapat dipadukan dengan integrasi pihak ketiga bila sesuai dengan kebutuhan dan konteks kerja.</p></div>
        </div>
      </div>
      <div className="mt-10" data-testid="product-level-taxonomy">
        <div className="eyebrow">TAKSONOMI PENAWARAN · RENCANA STRATEGIS</div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {productLevels.map(level => <article key={level.no} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`product-level-${level.no}`}>
            <div className="font-mono text-[10px] text-[#8bdcff]">LEVEL {level.no}</div>
            <h3 className="mt-2 text-[14px] font-semibold text-[#e5edf0]">{level.title}</h3>
            <p className="mt-2 text-[11px] leading-5 text-[#91a0a8]">{level.text}</p>
          </article>)}
        </div>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-[.72fr_1.28fr]">
        <div><div className="eyebrow">URUTAN PENGEMBANGAN PENDAPATAN</div><h3 className="display-font mt-3 max-w-[350px] text-3xl font-semibold leading-tight text-[#e6eef1]">Validasi lewat layanan.</h3><p className="mt-4 max-w-[350px] text-[12px] leading-6 text-[#91a0a8]">Prioritas tahun pertama: arus kas dari layanan sambil membangun SaaS bertahap. Tidak ada harga atau klaim produk siap jual.</p></div>
        <div className="divide-y divide-white/[.1] border-y border-white/[.1]">
          {phases.map(phase => <article key={phase.id} className="grid gap-3 py-5 sm:grid-cols-[44px_1fr]" data-testid={`business-phase-${phase.id}`}>
            <span className="font-mono text-[11px] text-[#8bdcff]">{phase.id}</span>
            <div><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-[14px] font-semibold text-[#e5edf0]">{phase.title}</h4><span className="font-mono text-[9px] tracking-[.1em] text-[#758792]">TAHAP {phase.id}</span></div>
              <p className="mt-2 text-[12px] leading-5 text-[#c2d0d6]">{phase.items}</p><p className="mt-1 text-[10px] leading-5 text-[#8798a1]">{phase.note}</p></div>
          </article>)}
        </div>
      </div>
      <div className="mt-14 grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-[.72fr_1.28fr]" data-testid="revenue-planning">
        <div><div className="eyebrow">PETA PENDAPATAN · PERENCANAAN</div><h3 className="display-font mt-3 max-w-[360px] text-3xl font-semibold leading-tight text-[#e6eef1]">Layanan membiayai pembelajaran.</h3><p className="mt-4 max-w-[360px] text-[12px] leading-6 text-[#91a0a8]">Sumber pendapatan di bawah adalah arah yang perlu diuji, bukan proyeksi, kontrak, atau jaminan hasil.</p></div>
        <div className="grid gap-2 sm:grid-cols-2" data-testid="revenue-streams">
          {revenueStreams.map((stream, index) => <article key={stream.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`revenue-stream-${index + 1}`}>
            <div className="flex items-center gap-2"><CircleDollarSign size={15} className="text-[#8bdcff]" /><h4 className="text-[12px] font-semibold text-[#e5edf0]">{stream.title}</h4></div>
            <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{stream.detail}</p>
          </article>)}
        </div>
      </div>
      <div className="mt-14 border-t border-white/10 pt-9" data-testid="opportunity-priorities">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><div className="eyebrow">OPPORTUNITY BACKLOG · P0–P3</div><h3 className="display-font mt-3 text-3xl font-semibold text-[#e6eef1] md:text-4xl">Prioritas untuk diuji.</h3></div>
          <p className="max-w-[480px] text-[11px] leading-5 text-[#91a0a8]">Urutan sementara dari blueprint strategis, bukan komitmen roadmap, penawaran aktif, atau produk yang siap dijual.</p>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {opportunities.map(group => <article key={group.priority} className="border border-white/[.1] bg-[#121e26] p-4" data-testid={`priority-${group.priority.toLowerCase()}`}>
            <div className="flex items-baseline justify-between"><span className="font-mono text-[11px] font-medium text-[#8bdcff]">{group.priority}</span><span className="text-[9px] text-[#71838d]">USULAN STRATEGIS</span></div>
            <h4 className="mt-3 text-[13px] font-semibold text-[#e4edf0]">{group.title}</h4>
            <ul className="mt-3 space-y-2">
              {group.items.map(item => <li key={item} className="flex gap-2 text-[10px] leading-5 text-[#a5b3ba]"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#8bdcff]" />{item}</li>)}
            </ul>
          </article>)}
        </div>
      </div>
      <div className="mt-8 flex gap-3 border-l-2 border-[#8bdcff] bg-[#8bdcff]/[.045] px-4 py-3" data-testid="provisional-roadmap-note">
        <RouteIcon size={16} className="mt-0.5 shrink-0 text-[#8bdcff]" />
        <p className="text-[10px] leading-5 text-[#a9b8bf]"><strong className="text-[#dce8ed]">Roadmap provisional.</strong> Tahapannya merupakan kerangka perencanaan: pelajari kebutuhan, uji solusi layanan, standardisasi pola yang berulang, lalu pertimbangkan produk digital atau SaaS. Prioritas dapat berubah mengikuti validasi dan kapasitas.</p>
      </div>
      <div className="mt-14 border-t border-white/10 pt-10" data-testid="founder-led-operating-model">
        <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 05 · MODEL OPERASI</div><h3 className="display-font mt-3 max-w-[480px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Founder-led.<br /><span className="text-[#8bdcff]">Tumbuh sesuai kapasitas.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN FINAL · FOUNDER-LED</span>
            <p className="mt-3 max-w-[580px] text-[12px] leading-6 text-[#a7b5bc]">Gustafta saat ini dijalankan oleh satu founder, dengan AI sebagai pendukung kerja dan spesialis eksternal saat keahlian, kapasitas, proyek, serta cashflow mendukung. Struktur tim tidak diperbesar sebelum kebutuhan berulang terbukti.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] md:grid-cols-3">
          <article className="bg-[#121e26] p-5" data-testid="operating-founder-functions">
            <div className="flex items-center gap-2 text-[#8bdcff]"><UserRound size={17} /><span className="font-mono text-[9px] tracking-[.1em]">PUSAT TANGGUNG JAWAB</span></div>
            <h4 className="mt-4 text-[14px] font-semibold text-[#e5edf0]">Founder mengelola lima fungsi</h4>
            <ul className="mt-3 space-y-2">{operatingFunctions.map(item => <li key={item} className="flex gap-2 text-[10px] leading-5 text-[#9eacb4]"><span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#8bdcff]" />{item}</li>)}</ul>
            <p className="mt-3 border-t border-white/10 pt-3 text-[10px] leading-5 text-[#788b95]">Fungsi diprioritaskan menurut dampak; bukan lima pekerjaan harian yang harus dilakukan sekaligus.</p>
          </article>
          <article className="bg-[#121e26] p-5" data-testid="operating-workforce">
            <div className="flex items-center gap-2 text-[#8bdcff]"><Bot size={17} /><span className="font-mono text-[9px] tracking-[.1em]">MODEL SUMBER DAYA</span></div>
            <h4 className="mt-4 text-[14px] font-semibold text-[#e5edf0]">Founder + AI + spesialis eksternal</h4>
            <div className="mt-4 space-y-3">
              <p className="text-[10px] leading-5 text-[#9eacb4]"><strong className="text-[#dce8ed]">AI</strong> membantu riset, konten, proposal, coding, dokumentasi, laporan, dan otomasi.</p>
              <p className="text-[10px] leading-5 text-[#9eacb4]"><strong className="text-[#dce8ed]">Freelancer / mitra</strong> menambah kapasitas atau keahlian khusus dengan ruang lingkup, biaya, tenggat, dan hak kerja yang jelas.</p>
              <p className="border-t border-white/10 pt-3 text-[10px] leading-5 text-[#788b95]">AI tidak menggantikan tinjauan manusia untuk keputusan penting, kontrak, keuangan, keamanan, dan kualitas teknis.</p>
            </div>
          </article>
          <article className="bg-[#121e26] p-5" data-testid="operating-standards">
            <div className="flex items-center gap-2 text-[#8bdcff]"><ClipboardList size={17} /><span className="font-mono text-[9px] tracking-[.1em]">STANDAR MINIMUM</span></div>
            <h4 className="mt-4 text-[14px] font-semibold text-[#e5edf0]">Digital-first, tercatat, dan terjaga</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#9eacb4]">SOP praktis menjadi standar untuk alur kerja inti:</p>
            <div className="mt-3 flex flex-wrap gap-1.5">{operatingSops.map(item => <span key={item} className="border border-white/10 px-2 py-1 text-[9px] text-[#9eacb4]">{item}</span>)}</div>
            <p className="mt-3 border-t border-white/10 pt-3 text-[10px] leading-5 text-[#788b95]">Pengadaan tenaga dan teknologi mengikuti kebutuhan aktual, keamanan, pemeliharaan, dan kemampuan cashflow.</p>
          </article>
        </div>
        <div className="mt-8 grid gap-6 border border-white/[.09] bg-white/[.02] p-5 md:grid-cols-[.62fr_1.38fr]" data-testid="operational-roadmap">
          <div>
            <div className="flex items-center gap-2 text-[#8bdcff]"><CalendarDays size={16} /><span className="font-mono text-[9px] tracking-[.1em]">KERANGKA 12 BULAN</span></div>
            <h4 className="mt-3 text-[16px] font-semibold text-[#e5edf0]">Ekspansi bukan otomatis.</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Tinjau setiap fase berdasarkan cashflow, beban kerja, dan pipeline; periode ini bukan tenggat atau janji perekrutan.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {operatingPhases.map((phase, index) => <article key={phase.period} className="border-l border-[#8bdcff]/40 pl-3" data-testid={`operational-phase-${index + 1}`}>
              <span className="font-mono text-[9px] text-[#8bdcff]">{phase.period}</span>
              <h5 className="mt-1 text-[11px] font-semibold text-[#dce8ed]">{phase.title}</h5>
              <p className="mt-1 text-[9px] leading-4 text-[#8798a1]">{phase.detail}</p>
            </article>)}
          </div>
        </div>
      </div>
      <div id="bagian-06" className="mt-14 border-t border-white/10 pt-10" data-testid="financial-architecture">
        <div className="grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 06 · MODEL & ARSITEKTUR KEUANGAN</div><h3 className="display-font mt-3 max-w-[500px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Cashflow lebih dulu.<br /><span className="text-[#8bdcff]">Angka harus terbukti.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">MODAL AWAL · BOOTSTRAP</span>
            <p className="mt-3 max-w-[600px] text-[12px] leading-6 text-[#a7b5bc]">Model keuangan disusun untuk Gustafta yang founder-led dengan modal sangat terbatas. Nominal modal dan target pendapatan belum ditetapkan; tidak ada proyeksi rupiah, harga, atau margin yang diasumsikan.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3" data-testid="business-model-canvas">
          {canvasBlocks.map((block, index) => <article key={block.title} className="min-h-[126px] bg-[#121e26] p-4" data-testid={`canvas-block-${index + 1}`}>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">BMC · 0{index + 1}</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{block.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{block.detail}</p>
          </article>)}
        </div>
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><div className="eyebrow">ARSITEKTUR PENDAPATAN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Jasa membiayai tahap berikutnya.</h4></div>
            <p className="max-w-[430px] text-[10px] leading-5 text-[#8798a1]">Arah cashflow-first: jual layanan yang tervalidasi, bangun recurring revenue jika dukungan dapat dipenuhi, lalu skala aset digital setelah ada bukti pasar.</p>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {financialHorizons.map(item => <article key={item.number} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`revenue-horizon-${item.number}`}>
              <span className="font-mono text-[10px] text-[#8bdcff]">HORIZON {item.number}</span>
              <h5 className="mt-2 text-[13px] font-semibold text-[#e5edf0]">{item.title}</h5>
              <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{item.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-9" data-testid="service-first-priorities">
          <div className="grid gap-4 md:grid-cols-[.72fr_1.28fr] md:items-end">
            <div><div className="eyebrow">KEPUTUSAN PENDAPATAN · SERVICE-FIRST</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Kombinasi layanan, prioritas jelas.</h4></div>
            <p className="max-w-[600px] text-[10px] leading-5 text-[#8798a1]">Dalam 12 bulan pertama, jasa menjadi prioritas pendapatan; produk tetap dibangun bertahap. Lini berikut adalah arsitektur penawaran untuk divalidasi, bukan katalog yang menyatakan semua layanan aktif atau tersedia bersamaan.</p>
          </div>
          <div className="mt-5 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3">
            {prioritizedServices.map((service, index) => <article key={service.title} className="min-h-[150px] bg-[#121e26] p-4" data-testid={`service-priority-${index + 1}`}>
              <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">{service.role}</span>
              <h5 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{service.title}</h5>
              <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{service.detail}</p>
              <p className="mt-3 border-t border-white/10 pt-2 text-[9px] text-[#a7b5bc]">MODEL · {service.model}</p>
            </article>)}
          </div>
          <p className="mt-3 text-[9px] leading-5 text-[#758792]" data-testid="service-price-disclaimer">Rentang harga usulan disimpan sebagai hipotesis uji internal; belum ditampilkan sebagai harga publik karena biaya, scope, kapasitas founder, dan penerimaan pasar perlu dikonfirmasi.</p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <div className="eyebrow">KEBIJAKAN MODAL TERBATAS</div>
            <h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Jaga biaya tetap ringan.</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Pedoman awal untuk pilihan bootstrap; nominal dan persentase anggaran akan diisi setelah biaya serta kapasitas aktual diketahui.</p>
            <ul className="mt-4 space-y-3">{bootstrapRules.map((rule, index) => <li key={rule} className="flex gap-2 text-[10px] leading-5 text-[#a5b3ba]" data-testid={`bootstrap-rule-${index + 1}`}><Check size={13} className="mt-0.5 shrink-0 text-[#8bdcff]" />{rule}</li>)}</ul>
          </div>
          <div>
            <div className="flex items-center gap-2"><Calculator size={16} className="text-[#8bdcff]" /><div className="eyebrow">UNIT ECONOMICS · RUMUS, BUKAN HASIL AKTUAL</div></div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2" data-testid="unit-economics-formulas">
              {unitEconomics.map((metric, index) => <article key={metric.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`unit-economics-${index + 1}`}>
                <h5 className="text-[11px] font-semibold text-[#e5edf0]">{metric.title}</h5>
                <p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">{metric.formula}</p>
              </article>)}
            </div>
            <p className="mt-3 border-l border-[#8bdcff]/50 pl-3 text-[10px] leading-5 text-[#8798a1]">Harga berbasis nilai tetap diuji terhadap biaya langsung, waktu founder, lisensi, risiko, dukungan, dan kapasitas. Jangan menetapkan rasio LTV/CAC sebelum data nyata tersedia.</p>
          </div>
        </div>
        <div className="mt-10 border border-white/[.09] bg-white/[.02] p-5" data-testid="financial-roadmap">
          <div className="grid gap-4 md:grid-cols-[.55fr_1.45fr] md:items-end">
            <div><div className="eyebrow">KERANGKA KEUANGAN · 12 BULAN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Tinjau per fase.</h4></div>
            <p className="text-[10px] leading-5 text-[#8798a1]">Tahapan dan KPI bersifat rancangan, bukan target tanggal atau jaminan hasil. Pendapatan, margin, BEP, runway, dan biaya diisi dari catatan aktual setelah baseline terbentuk.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {financePhases.map((phase, index) => <article key={phase.period} className="border-l border-[#8bdcff]/40 pl-3" data-testid={`financial-phase-${index + 1}`}>
              <span className="font-mono text-[9px] text-[#8bdcff]">{phase.period}</span>
              <h5 className="mt-1 text-[11px] font-semibold text-[#dce8ed]">{phase.title}</h5>
              <p className="mt-1 text-[9px] leading-4 text-[#8798a1]">{phase.detail}</p>
            </article>)}
          </div>
        </div>
      </div>
      <div id="bagian-07" className="mt-14 border-t border-white/10 pt-10" data-testid="digital-products-saas-strategy">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 07 · PRODUK DIGITAL & SAAS</div><h3 className="display-font mt-3 max-w-[500px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Produk digital<br /><span className="text-[#8bdcff]">membuka jalan ke SaaS.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN FINAL · PORTOFOLIO DIGITAL-FIRST</span>
            <p className="mt-3 max-w-[620px] text-[12px] leading-6 text-[#a7b5bc]">Digital products menjadi pintu masuk untuk akuisisi dan validasi; kebutuhan berulang dapat berkembang menjadi SaaS. Strategi teknologinya hybrid—mengintegrasikan layanan yang sesuai sambil membangun kemampuan inti sendiri secara bertahap.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-2 md:grid-cols-4" data-testid="product-growth-path">
          {productGrowthStages.map((stage, index) => <article key={stage.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`product-stage-${index + 1}`}>
            <span className="font-mono text-[9px] text-[#8bdcff]">TAHAP 0{index + 1}</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{stage.title}</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{stage.detail}</p>
          </article>)}
        </div>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div><div className="eyebrow">PRODUK DIGITAL · RENCANA, BELUM KATALOG AKTIF</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Mulai dari kebutuhan konstruksi.</h4></div>
          <p className="max-w-[480px] text-[10px] leading-5 text-[#8798a1]">Batas rencana awal: 2–3 produk digital dan satu SaaS MVP; urutan dan jumlah bergantung pada validasi, cashflow, serta kapasitas founder.</p>
        </div>
        <div className="mt-4 grid gap-px border border-white/[.09] bg-white/[.09] md:grid-cols-3" data-testid="digital-product-candidates">
          {digitalProductCandidates.map(item => <article key={item.number} className="min-h-[190px] bg-[#121e26] p-4" data-testid={`digital-product-candidate-${item.number}`}>
            <span className="font-mono text-[9px] tracking-[.08em] text-[#8bdcff]">{item.number} · {item.status}</span>
            <h5 className="mt-3 text-[12px] font-semibold leading-5 text-[#e5edf0]">{item.title}</h5>
            <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{item.detail}</p>
            <p className="mt-3 border-t border-white/10 pt-2 text-[9px] text-[#a7b5bc]">MODEL · {item.model}</p>
          </article>)}
        </div>
        <div className="mt-4 grid gap-5 border border-[#8bdcff]/20 bg-[#8bdcff]/[.045] p-5 md:grid-cols-[.72fr_1.28fr]" data-testid="construction-saas-mvp">
          <div>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">KANDIDAT SAAS MVP · KONTRAKTORAI</span>
            <h4 className="display-font mt-3 text-2xl font-semibold text-[#e6eef1]">KontraktorAI Productivity Platform</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#9eacb4]">Rencana platform berlangganan untuk kebutuhan yang berulang. Ini belum menandakan MVP tersedia atau jadwal peluncuran telah dijanjikan.</p>
          </div>
          <div>
            <h5 className="text-[11px] font-semibold text-[#dce8ed]">Tiga fungsi inti untuk diuji</h5>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {saasCoreFeatures.map((feature, index) => <div key={feature} className="border border-white/10 bg-[#111c23]/70 p-3" data-testid={`saas-core-feature-${index + 1}`}>
                <span className="font-mono text-[9px] text-[#8bdcff]">0{index + 1}</span>
                <p className="mt-2 text-[10px] leading-5 text-[#c0cdd3]">{feature}</p>
              </div>)}
            </div>
            <p className="mt-3 text-[9px] leading-5 text-[#8798a1]">Akun pengguna, workspace, integrasi AI, dan subscription menjadi komponen pendukung; ruang lingkup MVP harus tetap dibatasi dan diuji bersama pengguna.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-[.55fr_1.45fr]" data-testid="saas-integration-governance">
          <div><div className="eyebrow">INTEGRATE FIRST · BUILD CORE LAST</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Modular, aman, dapat dipindahkan.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Pilihan platform ditentukan per kebutuhan, lisensi, biaya, keamanan, dan kemampuan pemeliharaan.</p></div>
          <ul className="grid gap-2 sm:grid-cols-2">{saasGovernance.map((rule, index) => <li key={rule} className="flex gap-2 border border-white/[.08] bg-white/[.02] p-3 text-[10px] leading-5 text-[#a5b3ba]" data-testid={`saas-governance-${index + 1}`}><Check size={13} className="mt-0.5 shrink-0 text-[#8bdcff]" />{rule}</li>)}</ul>
        </div>
        <p className="mt-5 border-l border-[#8bdcff]/50 pl-3 text-[9px] leading-5 text-[#758792]" data-testid="part07-validation-note">Gate rilis: validasi masalah dan kesediaan membayar → prototype/MVP → pilot 3–5 pengguna sebagai sasaran uji → standardisasi, dokumentasi, keamanan, biaya, dan dukungan. Angka pilot adalah target rencana, bukan pengguna yang sudah ada.</p>
      </div>
      <div id="ai-concierge" className="mt-14 border-t border-white/10 pt-10" data-testid="ai-concierge-strategy">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div>
            <div className="eyebrow">AI CONCIERGE · PRODUK EKOSISTEM GUSTAFTA</div>
            <h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Satu gerbang cerdas.<br /><span className="text-[#8bdcff]">Knowledge hingga kolaborasi.</span></h3>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN STRATEGIS FINAL · AI GATEWAY GUSTAFTA</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">AI Concierge menjadi lapisan interaksi untuk membantu pengunjung, UMKM, profesional, dan pelaku industri menemukan informasi, pengetahuan, solusi, produk, serta jalur konsultasi atau kolaborasi. Ini adalah keputusan produk; pengembangan dan deployment belum dilaksanakan.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3" data-testid="ai-concierge-decisions">
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-modules">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">CAKUPAN MVP</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">Enam modul inti</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Asisten umum, pencarian knowledge, pencari solusi, lead dan konsultasi, gerbang kolaborasi, serta akun dasar.</p>
          </article>
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-access">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">MODEL AKSES</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">Gratis untuk pengunjung</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Informasi dan knowledge publik tidak mensyaratkan akun. Akun terdaftar mendapat fitur lanjutan bertahap; registrasi bukan penghalang untuk bertanya.</p>
          </article>
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-rag">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">KNOWLEDGE · HYBRID RAG</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">Jawaban berbasis sumber</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Gabungkan CMS, dokumen, katalog/database, dan referensi eksternal terpilih dengan metadata, status verifikasi, hak akses, tanggal pembaruan, serta sitasi.</p>
          </article>
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-build-buy-integrate">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">BUILD · BUY · INTEGRATE</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">Hybrid sesuai kebutuhan</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Gunakan layanan AI dan infrastruktur terkelola; integrasikan CMS, CRM, dan otomasi; bangun backend, orkestrasi knowledge, serta aturan bisnis khusus Gustafta.</p>
          </article>
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-human-handoff">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">LEAD · KOLABORASI · HUMAN HANDOFF</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">AI mengarahkan, manusia menindaklanjuti</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Tawarkan solusi terverifikasi, minta persetujuan sebelum mengumpulkan data minimum prospek, lalu arahkan pertanyaan yang tidak terjawab atau sensitif kepada manusia.</p>
          </article>
          <article className="min-h-[145px] bg-[#121e26] p-4" data-testid="ai-concierge-monetization">
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">MONETISASI BERTAHAP</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">Gateway gratis lebih dahulu</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">Mulai untuk akuisisi audiens dan lead; jasa implementasi dan solusi enterprise menyusul setelah validasi. SaaS bukan sasaran monetisasi awal.</p>
          </article>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
          <div className="border border-[#8bdcff]/20 bg-[#8bdcff]/[.04] p-4" data-testid="ai-concierge-industry-taxonomy">
            <div className="eyebrow">CAKUPAN INDUSTRI · TAKSONOMI TETAP USULAN</div>
            <p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">AI Concierge dirancang agar dapat mengelompokkan pertanyaan ke delapan kategori yang diusulkan Gustafta: Construction, Energy, Electricity, Mining, Environment, Manufacturing, Logistics, serta Business & Digital Transformation. Lima sektor pertama tetap fokus inti KontraktorAI; kategori ekspansi dan lintas industri belum menjadi keputusan taksonomi final.</p>
          </div>
          <div className="border border-white/[.1] bg-white/[.025] p-4" data-testid="ai-concierge-guardrails">
            <div className="eyebrow">BATAS MVP · PRIVASI · KEAMANAN</div>
            <p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Tidak melakukan transaksi, pembayaran, atau pengelolaan proyek otomatis. Jangan mengarang informasi, mengekspos dokumen internal, atau mengklaim tindakan eksternal berhasil. Terapkan persetujuan, akses minimum, retensi jelas, pemantauan biaya, dan eskalasi manusia.</p>
          </div>
        </div>
        <div className="mt-6 border border-white/[.1] bg-white/[.025] p-4" data-testid="ai-concierge-roadmap">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><div className="eyebrow">RENCANA MVP · ESTIMASI 8 MINGGU</div><h4 className="display-font mt-2 text-xl font-semibold text-[#e6eef1]">Rancang, bangun, uji, lalu pilot.</h4></div>
            <span className="font-mono text-[9px] tracking-[.08em] text-[#8bdcff]">CHECKLIST · 0/37 DIVERIFIKASI</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="border-l border-[#8bdcff]/40 pl-3"><span className="font-mono text-[9px] text-[#8bdcff]">MINGGU 1–2</span><p className="mt-1 text-[10px] leading-5 text-[#a5b3ba]">PRD, user journey, alur percakapan, dan desain UI.</p></div>
            <div className="border-l border-[#8bdcff]/40 pl-3"><span className="font-mono text-[9px] text-[#8bdcff]">MINGGU 3–4</span><p className="mt-1 text-[10px] leading-5 text-[#a5b3ba]">Backend, LLM, ingestion knowledge, retrieval, dan sitasi.</p></div>
            <div className="border-l border-[#8bdcff]/40 pl-3"><span className="font-mono text-[9px] text-[#8bdcff]">MINGGU 5–6</span><p className="mt-1 text-[10px] leading-5 text-[#a5b3ba]">Solution finder, lead capture, akses pengguna, dan integrasi dasar.</p></div>
            <div className="border-l border-[#8bdcff]/40 pl-3"><span className="font-mono text-[9px] text-[#8bdcff]">MINGGU 7–8</span><p className="mt-1 text-[10px] leading-5 text-[#a5b3ba]">Evaluasi jawaban, keamanan, uji pilot, dan persiapan peluncuran.</p></div>
          </div>
          <p className="mt-4 border-t border-white/10 pt-3 text-[9px] leading-5 text-[#8798a1]">Estimasi bukan jaminan jadwal. Pemilihan vendor/platform AI dan CRM belum ditetapkan; WordPress.com Business hanya target CMS News dan situsnya belum aktif. Checklist adalah backlog rencana, bukan pekerjaan yang telah selesai.</p>
        </div>
      </div>
      <div id="bagian-08" className="mt-14 border-t border-white/10 pt-10" data-testid="consulting-collaboration-marketplace">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 08 · CONSULTING, COLLABORATION & MARKETPLACE</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Jaringan dahulu.<br /><span className="text-[#8bdcff]">Marketplace bertahap.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN FINAL · MANAGED MARKETPLACE</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">Gustafta menghubungkan ahli, perusahaan, proyek, tender, kemitraan, dan transaksi. Tahun pertama dimulai dengan proses manual yang dikelola founder untuk membuktikan aktivitas bisnis sebelum membangun platform self-service.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-3" data-testid="marketplace-pillars">
          {marketplacePillars.map((pillar, index) => <article key={pillar.title} className="min-h-[130px] bg-[#121e26] p-4" data-testid={`marketplace-pillar-${index + 1}`}>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">JARINGAN 0{index + 1}</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{pillar.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{pillar.detail}</p>
          </article>)}
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><div className="eyebrow">ROADMAP PLATFORM</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Manual → digital → intelligent.</h4></div>
            <p className="max-w-[460px] text-[10px] leading-5 text-[#8798a1]">Prioritas tahun pertama adalah managed marketplace dengan proyek, tender, matching, dan transaksi awal sebagai sasaran uji, bukan klaim aktivitas yang sudah berjalan.</p>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3" data-testid="marketplace-stages">
            {marketplaceStages.map((stage, index) => <article key={stage.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`marketplace-stage-${index + 1}`}>
              <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">{stage.label}</span>
              <h5 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{stage.title}</h5>
              <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{stage.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.66fr_1.34fr]">
          <div><div className="eyebrow">MODEL PENDAPATAN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Mulai dari layanan.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Konsultasi dan fasilitasi menjadi jalur awal; keanggotaan premium dan komisi diuji setelah ada manfaat, proses, dan transaksi yang dapat dibuktikan.</p></div>
          <div className="grid gap-2 sm:grid-cols-2" data-testid="marketplace-revenue-models">
            {marketplaceRevenue.map((item, index) => <article key={item.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`marketplace-revenue-${index + 1}`}>
              <h5 className="text-[11px] font-semibold text-[#e5edf0]">{item.title}</h5>
              <p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">{item.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-6 border border-[#8bdcff]/20 bg-[#8bdcff]/[.04] p-4" data-testid="marketplace-governance">
          <div className="eyebrow">KEPERCAYAAN · TRANSPARANSI · PERLINDUNGAN</div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">{marketplaceSafeguards.map((rule, index) => <li key={rule} className="flex gap-2 text-[10px] leading-5 text-[#a5b3ba]" data-testid={`marketplace-safeguard-${index + 1}`}><Check size={13} className="mt-0.5 shrink-0 text-[#8bdcff]" />{rule}</li>)}</ul>
        </div>
        <p className="mt-4 text-[9px] leading-5 text-[#758792]" data-testid="marketplace-availability-note">Rencana ekosistem ini bukan direktori, proyek, tender, atau layanan transaksi yang sudah aktif. Informasi peluang hanya boleh dipublikasikan setelah diverifikasi dan ditautkan ke sumber yang sah.</p>
      </div>
      <div id="bagian-09" className="mt-14 border-t border-white/10 pt-10" data-testid="gustafta-academy">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 09 · ACADEMY, COMPETENCY & PROFESSIONAL SERVICES</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Belajar, berkembang,<br /><span className="text-[#8bdcff]">menerapkan keahlian.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN FINAL · HYBRID PROFESSIONAL COMPETENCY ECOSYSTEM</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">Gustafta Academy menggabungkan pelatihan, pembelajaran digital, pengembangan kompetensi, kemitraan sertifikasi, dan layanan profesional. Sasaran mencakup individu, profesional, UMKM, serta perusahaan; program dibangun bertahap sesuai permintaan dan kapasitas instruktur.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="academy-pillars">
          {academyPillars.map((pillar, index) => <article key={pillar.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`academy-pillar-${index + 1}`}>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">PILAR 0{index + 1}</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{pillar.title}</h4>
            <p className="mt-2 text-[10px] leading-5 text-[#91a0a8]">{pillar.detail}</p>
          </article>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.64fr_1.36fr]">
          <div><div className="eyebrow">FOKUS PROGRAM · DIKEMBANGKAN BERTAHAP</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Tiga jalur belajar.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Instruktur berasal dari founder, ahli Experts Network, trainer, dan mitra; program prioritas dipilih berdasarkan kebutuhan pasar.</p></div>
          <div className="grid gap-2 sm:grid-cols-3" data-testid="academy-program-tracks">
            {academyProgramTracks.map((track, index) => <article key={track.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`academy-track-${index + 1}`}>
              <h5 className="text-[11px] font-semibold text-[#e5edf0]">{track.title}</h5>
              <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{track.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><div className="eyebrow">LMS · ROADMAP TEKNOLOGI</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Pakai dulu. Integrasikan. Kembangkan bila perlu.</h4></div>
            <p className="max-w-[430px] text-[10px] leading-5 text-[#8798a1]">Keputusan final: mulai dengan platform siap pakai, lalu integrasi dan pengembangan khusus jika skala serta kebutuhan membenarkan investasi.</p>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3" data-testid="academy-lms-stages">
            {lmsStages.map((stage, index) => <article key={stage.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`academy-lms-stage-${index + 1}`}>
              <span className="font-mono text-[9px] text-[#8bdcff]">TAHAP 0{index + 1}</span>
              <h5 className="mt-2 text-[11px] font-semibold text-[#e5edf0]">{stage.title}</h5>
              <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{stage.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-6 grid gap-5 border border-[#8bdcff]/20 bg-[#8bdcff]/[.04] p-4 md:grid-cols-[.72fr_1.28fr]" data-testid="academy-certification-policy">
          <div><div className="eyebrow">SERTIFIKASI · JELAS DAN TEPAT</div><h4 className="display-font mt-2 text-xl font-semibold text-[#e6eef1]">Program Gustafta ≠ sertifikasi resmi.</h4></div>
          <div className="grid gap-2 sm:grid-cols-2">
            <p className="border border-white/10 bg-[#111c23]/70 p-3 text-[10px] leading-5 text-[#a5b3ba]"><strong className="text-[#dce8ed]">Sertifikat Gustafta:</strong> bukti keikutsertaan atau penyelesaian program; jenis dan evaluasinya harus dijelaskan.</p>
            <p className="border border-white/10 bg-[#111c23]/70 p-3 text-[10px] leading-5 text-[#a5b3ba]"><strong className="text-[#dce8ed]">Sertifikasi eksternal:</strong> asesmen dan penerbitan melalui mitra yang berwenang. Gustafta tidak mengklaim kewenangan yang belum dimiliki.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.64fr_1.36fr]">
          <div><div className="eyebrow">MONETISASI FINAL</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Pendapatan dari belajar dan layanan.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Tahun pertama memprioritaskan kursus berbayar, corporate training, dan konsultasi. Subscription serta sertifikasi dikembangkan sejalan dengan katalog, peserta, dan mitra.</p></div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" data-testid="academy-revenue-model">
            {academyRevenue.map((item, index) => <article key={item.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`academy-revenue-${index + 1}`}>
              <h5 className="text-[11px] font-semibold text-[#e5edf0]">{item.title}</h5>
              <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{item.detail}</p>
            </article>)}
          </div>
        </div>
        <p className="mt-6 border-l border-[#8bdcff]/50 pl-3 text-[9px] leading-5 text-[#758792]" data-testid="academy-year-one-target">Sasaran perencanaan tahun pertama: Academy aktif dengan LMS awal, pelatihan, konsultasi, dan mitra sertifikasi. Jumlah program, peserta, serta mitra pada blueprint adalah target validasi, bukan capaian saat ini atau jaminan hasil.</p>
      </div>
      <div id="bagian-10" className="mt-14 border-t border-white/10 pt-10" data-testid="technology-data-security-architecture">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 10 · TECHNOLOGY, DATA & SECURITY ARCHITECTURE</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Hybrid, modular,<br /><span className="text-[#8bdcff]">aman sesuai risiko.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">KEPUTUSAN FINAL · 8 ARAH ARSITEKTUR TERKUNCI</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">Fondasi teknologi Gustafta berkembang mengikuti kebutuhan bisnis dan validasi. Gunakan layanan terkelola dan integrasi lebih dahulu; tingkatkan custom infrastructure serta pengembangan khusus hanya bila layak dari sisi kebutuhan, keamanan, biaya, dan pemeliharaan.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-4" data-testid="technology-decisions">
          {technologyDecisions.map((decision, index) => <article key={decision.title} className="min-h-[145px] bg-[#121e26] p-4" data-testid={`technology-decision-${index + 1}`}>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">ARAH 0{index + 1}</span>
            <h4 className="mt-2 text-[12px] font-semibold text-[#e5edf0]">{decision.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{decision.detail}</p>
          </article>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.66fr_1.34fr]">
          <div><div className="eyebrow">DATA GOVERNANCE & SECURITY BY DESIGN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Lindungi data sebelum memperluas penggunaannya.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Kontrol diterapkan sebanding dengan klasifikasi data dan tingkat kritikalitas aplikasi. Kepemilikan, tujuan penggunaan, dan hak akses harus jelas—terutama untuk data pelanggan, pembayaran, administrasi, dan AI.</p></div>
          <ul className="grid gap-2 sm:grid-cols-2" data-testid="technology-safeguards">
            {technologySafeguards.map((rule, index) => <li key={rule} className="flex gap-2 border border-white/[.08] bg-white/[.02] p-3 text-[10px] leading-5 text-[#a5b3ba]" data-testid={`technology-safeguard-${index + 1}`}><Check size={13} className="mt-0.5 shrink-0 text-[#8bdcff]" />{rule}</li>)}
          </ul>
        </div>
        <div className="mt-6 flex flex-col gap-3 border border-white/[.1] bg-white/[.025] p-4 md:flex-row md:items-center md:justify-between" data-testid="technology-stack-status">
          <div><div className="eyebrow">PRINSIP IMPLEMENTASI</div><p className="mt-1 text-[11px] leading-5 text-[#c2d0d6]">Cloud-first · modular · integrate first · satu sumber data utama per domain · portabilitas · biaya terkendali</p></div>
          <p className="max-w-[410px] text-[9px] leading-5 text-[#8798a1]">Vendor, produk, anggaran, dan spesifikasi teknis belum dikunci. Kedelapan keputusan menetapkan arah, bukan bukti bahwa seluruh kontrol keamanan atau integrasi sudah diterapkan.</p>
        </div>
      </div>
      <div id="bagian-11" className="mt-14 border-t border-white/10 pt-10" data-testid="marketing-growth-partnership">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 11 · MARKETING, MEDIA, COMMUNITY & GROWTH</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Tumbuh lewat konten,<br /><span className="text-[#8bdcff]">relasi, dan pendapatan.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#9eddf2]">FINAL & LOCKED · CASHFLOW FIRST</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">Gustafta memasarkan diri sebagai ekosistem hybrid. Tahun pertama, akuisisi pelanggan jasa dan proyek menjadi prioritas; SEO, konten, News, komunitas, partnership, produk digital, dan pendapatan berulang dibangun bertahap.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-px border border-white/[.09] bg-white/[.09] sm:grid-cols-2 xl:grid-cols-4" data-testid="growth-decisions">
          {growthDecisions.map((decision, index) => <article key={decision.title} className="min-h-[130px] bg-[#121e26] p-4" data-testid={`growth-decision-${index + 1}`}>
            <span className="font-mono text-[9px] tracking-[.1em] text-[#8bdcff]">ARAH 0{index + 1}</span>
            <h4 className="mt-2 text-[11px] font-semibold leading-5 text-[#e5edf0]">{decision.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{decision.detail}</p>
          </article>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.62fr_1.38fr]">
          <div><div className="eyebrow">OMNICHANNEL · WEBSITE AS THE HUB</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Kanal yang saling mengarahkan.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Website menjadi pusat informasi dan konversi; kanal distribusi memperluas jangkauan, menjaga hubungan, dan membawa calon pelanggan ke langkah berikutnya.</p></div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="growth-channels">
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[11px] font-semibold text-[#e5edf0]">Website & SEO</h5><p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">Pusat ekosistem, penemuan organik, intent pencarian, topical content, internal links, dan konversi.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[11px] font-semibold text-[#e5edf0]">Konten & media</h5><p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">Artikel, News, insight industri, edukasi, dan distribusi lintas platform.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[11px] font-semibold text-[#e5edf0]">Komunitas & pesan</h5><p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">Interaksi melalui komunitas, WhatsApp, email, dan kanal profesional.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[11px] font-semibold text-[#e5edf0]">Sales & partnership</h5><p className="mt-1 text-[10px] leading-5 text-[#91a0a8]">Direct selling, referral, distribusi mitra, dan kolaborasi proyek.</p></article>
          </div>
        </div>
        <div className="mt-8">
          <div><div className="eyebrow">CUSTOMER JOURNEY</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Dari ditemukan hingga kembali.</h4></div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5" data-testid="growth-funnel">
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="growth-funnel-step-1"><span className="font-mono text-[9px] text-[#8bdcff]">01 · AWARENESS</span><p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">SEO, News, konten, sosial, dan mitra mengenalkan solusi.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="growth-funnel-step-2"><span className="font-mono text-[9px] text-[#8bdcff]">02 · ENGAGEMENT</span><p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Insight dan komunitas membantu audiens memahami kebutuhan.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="growth-funnel-step-3"><span className="font-mono text-[9px] text-[#8bdcff]">03 · QUALIFIED LEAD</span><p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Inquiry melalui website, WhatsApp, email, atau referral dinilai sesuai kebutuhan.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="growth-funnel-step-4"><span className="font-mono text-[9px] text-[#8bdcff]">04 · CUSTOMER</span><p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Penawaran jasa atau proyek disepakati dengan ruang lingkup yang jelas.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="growth-funnel-step-5"><span className="font-mono text-[9px] text-[#8bdcff]">05 · RETENTION</span><p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Pengalaman baik mendorong layanan berulang dan rekomendasi.</p></article>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-[.58fr_1.42fr]">
          <div><div className="eyebrow">HYBRID NEWS & EDITORIAL</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Distribusi informasi dengan standar.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Gabungkan kurasi, ringkasan, analisis, dan editorial original untuk mendukung pengetahuan, SEO, serta akuisisi tanpa mengorbankan akurasi.</p></div>
          <ul className="grid gap-2 sm:grid-cols-2" data-testid="growth-editorial-rules">
            {growthEditorialRules.map((rule, index) => <li key={rule} className="flex gap-2 border border-white/[.08] bg-white/[.02] p-3 text-[10px] leading-5 text-[#a5b3ba]" data-testid={`growth-editorial-rule-${index + 1}`}><Check size={13} className="mt-0.5 shrink-0 text-[#8bdcff]" />{rule}</li>)}
          </ul>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><div className="eyebrow">GROWTH ROADMAP · 12 BULAN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Validasi sebelum memperbesar.</h4></div>
            <p className="max-w-[440px] text-[10px] leading-5 text-[#8798a1]">Tahapan mengikuti kapasitas founder dan kondisi cashflow; periode ini adalah kerangka, bukan jaminan tanggal atau hasil.</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="growth-roadmap">
            {growthPhases.map((phase, index) => <article key={phase.period} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`growth-phase-${index + 1}`}>
              <span className="font-mono text-[9px] text-[#8bdcff]">{phase.period}</span>
              <h5 className="mt-2 text-[11px] font-semibold text-[#e5edf0]">{phase.title}</h5>
              <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{phase.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 border border-[#8bdcff]/20 bg-[#8bdcff]/[.04] p-4 md:flex-row md:items-center md:justify-between" data-testid="growth-kpi-priority">
          <div><div className="eyebrow">KPI PRIORITAS · TANPA TARGET ANGKA FIKTIF</div><p className="mt-1 text-[10px] leading-5 text-[#c1d0d6]">Pendapatan & cashflow → pelanggan berbayar → qualified leads → proyek berhasil → repeat customers → recurring revenue → organic traffic → komunitas.</p></div>
          <p className="max-w-[340px] text-[9px] leading-5 text-[#8798a1]">Target numerik ditetapkan setelah kapasitas, harga, dan baseline terukur. Trafik atau pengikut bukan indikator keberhasilan bila tidak berkontribusi ke prospek dan pendapatan.</p>
        </div>
      </div>
      <div id="bagian-12" className="mt-14 border-t border-white/10 pt-10" data-testid="project-management-roadmap-kpi">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 12 · PROJECT MANAGEMENT, ROADMAP & KPI</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">Dari strategi<br /><span className="text-[#8bdcff]">ke eksekusi terukur.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-amber-300/25 bg-amber-300/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-amber-100">KERANGKA USULAN · MENUNGGU INPUT OPERASIONAL</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">Bagian 12 menghubungkan keputusan sebelumnya ke satu sistem kerja yang lean, founder-led, AI-assisted, dan cashflow-oriented. Roadmap dan KPI di bawah adalah kerangka perencanaan, bukan janji tanggal maupun pencapaian.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="execution-roadmap-phases">
          {executionPhases.map((phase, index) => <article key={phase.period} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`execution-phase-${index + 1}`}>
            <span className="font-mono text-[9px] text-[#8bdcff]">{phase.period}</span>
            <h4 className="mt-2 text-[11px] font-semibold text-[#e5edf0]">{phase.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{phase.detail}</p>
          </article>)}
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.62fr_1.38fr]">
          <div><div className="eyebrow">SATU MASTER BACKLOG</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Batasi pekerjaan. Tinjau status.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Kelola layanan, produk, platform, academy, media, pemasaran, dan infrastruktur dalam satu portfolio. Audit produk/aset yang sudah ada sebelum membangun ulang.</p></div>
          <div>
            <div className="flex flex-wrap gap-2" data-testid="project-lifecycle">
              {['Backlog', 'Ready', 'In Progress', 'Review', 'Done'].map(status => <span key={status} className="border border-white/10 bg-white/[.03] px-3 py-1.5 font-mono text-[9px] text-[#bdcbd1]">{status}</span>)}
              {['Blocked', 'On Hold'].map(status => <span key={status} className="border border-amber-200/20 bg-amber-200/[.04] px-3 py-1.5 font-mono text-[9px] text-amber-100">{status}</span>)}
            </div>
            <h5 className="mt-5 text-[10px] font-semibold text-[#dce8ed]">Prioritaskan berdasarkan:</h5>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="project-priority-criteria">
              {priorityCriteria.map((criterion, index) => <div key={criterion} className="border border-white/[.08] bg-white/[.02] p-2.5 text-[9px] leading-4 text-[#a5b3ba]" data-testid={`priority-criterion-${index + 1}`}>{criterion}</div>)}
            </div>
            <p className="mt-2 text-[9px] leading-5 text-[#758792]">Bobot penilaian, batas jumlah proyek aktif, dan keputusan portfolio belum dikunci; nilai dengan data sebelum menetapkan prioritas.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[.62fr_1.38fr]">
          <div><div className="eyebrow">FINANCIAL PLANNING · CASHFLOW FIRST</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Anggaran mengikuti kemampuan.</h4><p className="mt-2 text-[10px] leading-5 text-[#8798a1]">Gunakan pendekatan bootstrap dan jadikan kapasitas founder sebagai batas. Nominal modal dan baseline biaya belum tersedia; jangan menetapkan alokasi persentase, target pendapatan, atau komitmen belanja sebelum data aktual diperiksa.</p></div>
          <div className="grid gap-2 sm:grid-cols-2" data-testid="project-financial-controls">
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[10px] font-semibold text-[#e5edf0]">Setiap proyek mencatat</h5><p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Budget yang disetujui, estimasi dan biaya aktual, revenue, biaya langsung, gross profit, serta variance; ROI jika relevan.</p></article>
            <article className="border border-white/[.1] bg-white/[.025] p-3"><h5 className="text-[10px] font-semibold text-[#e5edf0]">Empat tema OKR usulan</h5><p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Mesin pendapatan berkelanjutan · produk digital tervalidasi · kehadiran pasar · sistem operasi efisien.</p></article>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><div className="eyebrow">EXECUTIVE KPI DASHBOARD · RENCANA</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Ukur hasil di lima area.</h4></div>
            <p className="max-w-[450px] text-[10px] leading-5 text-[#8798a1]">Dashboard dibangun setelah data operasional tersedia. KPI mengukur kinerja nyata; target numerik ditetapkan setelah baseline, kapasitas, harga, dan anggaran disepakati.</p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5" data-testid="executive-kpi-areas">
            {[
              { title: 'Finance', detail: 'Revenue, operating cashflow, gross margin, budget variance.' },
              { title: 'Sales', detail: 'Qualified leads, conversion, paying customers, repeat customers.' },
              { title: 'Projects', detail: 'Progress, deadline, cost, on-time delivery, satisfaction.' },
              { title: 'Products', detail: 'Adoption, paying users, quality, uptime, critical issues.' },
              { title: 'Growth & ecosystem', detail: 'Organic leads, community, partnerships, recurring revenue.' },
            ].map((area, index) => <article key={area.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`kpi-area-${index + 1}`}>
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">{area.title}</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">{area.detail}</p>
            </article>)}
          </div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-3" data-testid="execution-review-cadence">
          {executionReviews.map((review, index) => <article key={review.title} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`execution-review-${index + 1}`}>
            <span className="font-mono text-[9px] text-[#8bdcff]">TINJAUAN {review.title.toUpperCase()}</span>
            <p className="mt-2 text-[9px] leading-5 text-[#a5b3ba]">{review.detail}</p>
          </article>)}
        </div>
        <div className="mt-6 border border-amber-200/15 bg-amber-200/[.03] p-4" data-testid="part12-open-inputs">
          <div className="eyebrow text-amber-100/90">INPUT YANG MASIH TERBUKA SEBELUM DIKUNCI</div>
          <p className="mt-2 text-[10px] leading-5 text-[#aebbc0]">Jumlah modal dan biaya rutin aktual, status tiap produk/aset, target revenue/pelanggan/proyek, pilihan tools operasional, serta pembobotan prioritas masih perlu dikonfirmasi atau diaudit. Kapasitas founder harus membatasi scope; target numerik belum ditetapkan.</p>
          <p className="mt-2 text-[9px] leading-5 text-[#758792]">Kategori tools ditentukan, tetapi vendor belum dipilih. Fase bulan 1–12 adalah rencana relatif dan dapat diubah berdasarkan baseline, cashflow, serta kapasitas.</p>
        </div>
      </div>
      <div id="bagian-13" className="mt-14 border-t border-white/10 pt-10" data-testid="news-cms-decisions">
        <div className="grid gap-5 md:grid-cols-[.78fr_1.22fr] md:items-end">
          <div><div className="eyebrow">BAGIAN 13 · KONTRAKTORAI NEWS & CMS</div><h3 className="display-font mt-3 max-w-[520px] text-3xl font-semibold leading-tight text-[#e6eef1] md:text-4xl">News industri.<br /><span className="text-[#8bdcff]">Editorial tetap manusia.</span></h3></div>
          <div>
            <span className="inline-flex items-center gap-2 border border-[#8bdcff]/25 bg-[#8bdcff]/[.06] px-3 py-1.5 font-mono text-[9px] tracking-[.1em] text-[#b9eaff]">KEPUTUSAN STRATEGIS · FINAL & TERKUNCI</span>
            <p className="mt-3 max-w-[630px] text-[12px] leading-6 text-[#a7b5bc]">KontraktorAI News menggabungkan kurasi, pengetahuan, dan analisis industri. Enam keputusan mengunci arah editorial serta monetisasi awal; ini belum berarti CMS, integrasi, atau otomasi sudah dibangun.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3" data-testid="news-cms-decision-cards">
          {newsCmsDecisions.map((decision, index) => <article key={decision.number} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`news-cms-decision-${index + 1}`}>
            <span className="font-mono text-[9px] text-[#8bdcff]">KEPUTUSAN {decision.number}</span>
            <h4 className="mt-2 text-[11px] font-semibold text-[#e5edf0]">{decision.title}</h4>
            <p className="mt-1.5 text-[10px] leading-5 text-[#91a0a8]">{decision.detail}</p>
          </article>)}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <article className="border border-[#8bdcff]/20 bg-[#8bdcff]/[.04] p-4" data-testid="news-editorial-human-review">
            <div className="eyebrow">ALUR EDITORIAL WAJIB</div>
            <p className="mt-2 text-[10px] leading-5 text-[#c1d0d6]">Temukan dan verifikasi sumber → AI membantu ringkasan/draf/SEO → editor memeriksa fakta, konteks, kualitas, dan hak cipta → jadwalkan atau terbitkan setelah review. AI tidak memiliki kewenangan publikasi; konten sensitif memerlukan persetujuan khusus.</p>
          </article>
          <article className="border border-white/[.1] bg-white/[.025] p-4" data-testid="news-cms-implementation-boundary">
            <div className="eyebrow">WORDPRESS.COM BUSINESS DIPILIH · SITUS MENUNGGU AKTIVASI</div>
            <p className="mt-2 text-[10px] leading-5 text-[#a5b3ba]">Domain kontraktorai.wordpress.com sudah dikonfirmasi, tetapi situs belum aktif. Adapter feed publik baca-saja disiapkan tanpa konektor Replit atau kredensial; belum dapat diverifikasi dengan artikel live. Artikel yang disetujui tetap mengikuti review manusia sebelum distribusi dan monetisasi prospek layanan Gustafta.</p>
          </article>
        </div>
        <div className="mt-8 border-t border-white/10 pt-7" data-testid="news-cms-implementation-spec">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><div className="eyebrow">SPESIFIKASI AWAL · ADAPTER PUBLIK READ-ONLY DISIAPKAN</div><h4 className="display-font mt-2 text-2xl font-semibold text-[#e6eef1]">Siapkan sistem editorial sebelum otomasi.</h4></div>
            <div className="border border-amber-200/20 bg-amber-200/[.04] px-3 py-2 font-mono text-[9px] text-amber-100" data-testid="news-cms-mvp-status">CHECKLIST MVP · 0/38 TERVERIFIKASI</div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-sitemap">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Sitemap dalam portal utama</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">News dan kanal sektor/topik, proyek, teknologi, regulasi, analisis, knowledge, pencarian, newsletter, tentang, dan kontak. Struktur rute perlu diselaraskan dengan portal yang ada.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-core-modules">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Modul CMS inti</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Dashboard, artikel, sumber, sektor/kategori/tag, media, penulis, workflow, SEO, analytics, pengguna/peran, dan pengaturan.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-data-lifecycle">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Data dan status editorial</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Artikel menyimpan sumber, tanggal, sektor, kategori, penulis/editor, media, SEO, sensitivitas, jadwal, dan riwayat status dari Inbox sampai Published/Needs Update.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-ai-controls">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Batas AI dan verifikasi</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Kelola sumber primer, sekunder, dan pendukung; periksa duplikasi, fakta, tanggal kejadian/publikasi, atribusi, hak cipta, serta konten sensitif.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-lead-funnel">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Jalur konten ke prospek</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Artikel → CTA solusi → formulir/WhatsApp → kualifikasi CRM → tindak lanjut founder. Kumpulkan data seperlunya dengan pemberitahuan privasi dan persetujuan.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-security">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Keamanan minimum</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Akses berbasis peran, audit log, backup dan pemulihan, validasi file, proteksi admin, serta pemisahan konten publik dari data prospek.</p>
            </article>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3" data-testid="news-cms-editorial-details">
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-lifecycle">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Siklus status artikel</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Inbox → Researching → AI Draft → Human Editing → Pending Approval → Approved → Scheduled → Published → Archived/Needs Update. Catat perubahan, pelaku, dan waktunya.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-taxonomy">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Sektor dan kategori terpisah</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Lima sektor: konstruksi, energi, ketenagalistrikan, pertambangan, lingkungan. Kategori lintas sektor: News, Projects, Business, Technology, Regulation, Market Intelligence, Research, Career, Education, Opinion.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-source-tiers">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Tingkat sumber dan fakta</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Sumber primer diprioritaskan; media profesional diverifikasi silang; blog, forum, dan media sosial hanya petunjuk awal. Catat tautan, tanggal, atribusi, dan kredibilitas.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-ai-output">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Output bantuan AI</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Draf, ringkasan, fakta, pihak/lokasi, angka yang bersumber, saran sektor/tag, dan tautan referensi. Pisahkan tanggal kejadian dari pengumuman dan publikasi; tandai informasi yang belum terverifikasi.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-sensitive-review">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Persetujuan khusus</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Editor-in-Chief menyetujui isu hukum/sengketa, kecelakaan, tuduhan, informasi belum terkonfirmasi, kebijakan kontroversial, angka investasi, rahasia, dan data pribadi.</p>
            </article>
            <article className="border border-white/[.1] bg-white/[.025] p-3" data-testid="news-cms-lead-form">
              <h5 className="text-[10px] font-semibold text-[#e5edf0]">Data prospek minimum</h5>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">Nama, email atau WhatsApp, industri, kebutuhan, dan persetujuan privasi/tindak lanjut; perusahaan opsional. Kumpulkan data seperlunya lalu kualifikasi sebelum ditindaklanjuti founder.</p>
            </article>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><div className="eyebrow">RENCANA AWAL · 8 MINGGU KERJA · DAPAT BERGESER</div><h5 className="display-font mt-2 text-xl font-semibold text-[#e6eef1]">Tahap MVP yang diusulkan.</h5></div>
            <p className="max-w-[460px] text-[9px] leading-5 text-[#8798a1]">Bukan komitmen tanggal. Jadwal bergantung pada audit portal, aktivasi situs, validasi biaya dan keamanan, ketersediaan konten, serta kapasitas founder.</p>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" data-testid="news-cms-mvp-phases">
            {newsMvpPhases.map((phase, index) => <article key={phase.period} className="border border-white/[.1] bg-white/[.025] p-3" data-testid={`news-cms-mvp-phase-${index + 1}`}>
              <span className="font-mono text-[9px] text-[#8bdcff]">{phase.period}</span>
              <h6 className="mt-2 text-[10px] font-semibold text-[#e5edf0]">{phase.title}</h6>
              <p className="mt-1 text-[9px] leading-5 text-[#91a0a8]">{phase.detail}</p>
            </article>)}
          </div>
          <p className="mt-3 text-[9px] leading-5 text-[#758792]" data-testid="news-cms-metric-boundary">North Star yang diusulkan: qualified leads dari KontraktorAI News. Volume artikel, trafik, dan pendapatan belum menjadi target; estimasi kapasitas konten menunggu baseline dan review beban kerja.</p>
          <p className="mt-2 text-[9px] leading-5 text-[#758792]">Angka 0/38 menghitung kriteria MVP yang terverifikasi. Adapter baca-saja belum dihitung karena situs belum aktif dan respons artikel live belum diuji. Contoh editorial tetap demo; pemilihan platform tidak berarti langganan dibeli atau API tulis dihubungkan.</p>
        </div>
      </div>
      <p className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#778991]" data-testid="text-business-model-caveat"><Check size={13} className="mt-0.5 shrink-0 text-[#70bfdc]" />Enam unit bisnis dan tiga level penawaran adalah kerangka strategis, bukan katalog atau klaim ketersediaan. Harga, margin, dan proyeksi tetap perlu divalidasi.</p>
    </div>
  </section>;
}

function Ecosystem() {
  const tracks = [
    { icon: MessagesSquare, name: 'AI & konsultasi', detail: 'Ruang kebutuhan untuk memetakan persoalan dan menentukan kapan keahlian manusia diperlukan.' },
    { icon: Wrench, name: 'Alat digital & proyek', detail: 'Area eksplorasi kebutuhan perencanaan, administrasi, dan pengelolaan pekerjaan.' },
    { icon: FileCheck2, name: 'Tender & kepatuhan', detail: 'Topik terkait perizinan, tender, dokumen, dan praktik kepatuhan.' },
    { icon: Leaf, name: 'HSE & keberlanjutan', detail: 'Kebutuhan pengetahuan untuk keselamatan kerja dan praktik yang bertanggung jawab.' },
    { icon: BookOpen, name: 'Akademi & kompetensi', detail: 'Area pengembangan kapasitas dan kompetensi profesional industri.' },
    { icon: UsersRound, name: 'Kolaborasi & jejaring', detail: 'Peluang kebutuhan yang mempertemukan profesional dan mitra yang relevan.' },
  ];
  const marketWaves = [
    { number: '01', title: 'Konstruksi', detail: 'Fokus pertama: kontraktor UMKM dan profesional industri.' },
    { number: '02', title: 'Energi & ketenagalistrikan', detail: 'Ekspansi bersama ke kebutuhan sektor yang beririsan dengan proyek.' },
    { number: '03', title: 'Pertambangan & lingkungan', detail: 'Perluasan setelah model awal memberi pembelajaran dan terbukti berjalan.' },
  ];
  const taxonomyProposalGroups = [
    {
      label: 'FOKUS INTI · SUDAH DISETUJUI',
      title: 'KontraktorAI · lima sektor',
      categories: ['Construction & Infrastructure', 'Energy & Renewable Energy', 'Electricity & Power Systems', 'Mining & Mineral Resources', 'Environment & Sustainability'],
      detail: 'Konstruksi tetap menjadi pintu masuk; empat sektor lain dikembangkan bertahap.',
    },
    {
      label: 'USULAN EKSPANSI · BELUM FINAL',
      title: 'Industri berikutnya',
      categories: ['Manufacturing & Industrial Technology', 'Logistics, Transportation & Supply Chain'],
      detail: 'Pertimbangkan setelah fondasi produk, mitra, dan operasional awal lebih matang.',
    },
    {
      label: 'USULAN LINTAS INDUSTRI · BELUM FINAL',
      title: 'Business & Digital Transformation',
      categories: ['Business & Digital Transformation'],
      detail: 'Melayani kebutuhan UMKM, profesional, dan organisasi lintas sektor; tidak harus menunggu ekspansi vertikal.',
    },
  ];
  return <section id="tentang" className="bg-[#0e171d] py-20 md:py-28">
    <div className="container-wide">
      <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
        <div><div className="eyebrow">GUSTAFTA · TRILOGI GUSTAFTA · KONTRAKTORAI</div><h2 className="display-font mt-4 max-w-[700px] text-[clamp(2.7rem,5vw,4.6rem)] font-semibold leading-[.98]">UMKM sebagai pangkal.<br />Industri sebagai fokus.</h2></div>
        <p className="max-w-[380px] text-[13px] leading-6 text-[#9ba9b1]">Gustafta adalah brand induk dengan pasar utama UMKM. Trilogi Gustafta menjadi manifesto dan metodologi; KontraktorAI adalah brand industri yang didukung Gustafta, dengan fokus pada kebutuhan sektor dan hasil kerja.</p>
      </div>
      <div className="grid border-b border-white/10 py-7 md:grid-cols-3">
        <article className="border-b border-white/[.09] py-5 md:border-b-0 md:border-r md:pr-7" data-testid="brand-gustafta">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">BRAND INDUK</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">Gustafta</h3>
          <p className="mt-2 text-[12px] leading-5 text-[#91a0a8]">Melayani pasar UMKM secara luas melalui pengetahuan, kolaborasi, serta solusi digital dan AI yang berangkat dari kebutuhan nyata.</p>
          <p className="mt-4 text-[11px] font-medium text-[#c5d5dc]">Knowledge, Collaboration &amp; Creation through AI</p>
        </article>
        <article className="border-b border-white/[.09] py-5 md:border-b-0 md:border-r md:px-7" data-testid="brand-trilogi">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">MANIFESTO &amp; METODOLOGI</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">Trilogi Gustafta</h3>
          <p className="mt-2 text-[12px] leading-6 text-[#91a0a8]">Dari Monolog ke Dialog.<br />Dari Dialog ke Kolaborasi.<br />Dari Dialog ke Kreasi.</p>
        </article>
        <article className="py-5 md:pl-7" data-testid="brand-kontraktorai">
          <div className="font-mono text-[10px] tracking-[.12em] text-[#8bdcff]">BRAND INDUSTRI DIDUKUNG GUSTAFTA</div>
          <h3 className="mt-3 text-lg font-semibold text-[#e7eef1]">KontraktorAI</h3>
          <p className="mt-2 text-[12px] leading-5 text-[#91a0a8]">Portal solusi digital dan AI yang menghubungkan tantangan industri dengan langkah dan hasil yang relevan—bukan teknologi untuk teknologi.</p>
        </article>
      </div>
      <div className="py-8" data-testid="market-entry-waves">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><div className="eyebrow">FOKUS PASAR AWAL</div><h3 className="display-font mt-3 text-3xl font-semibold text-[#e7eef1] md:text-4xl">Bertahap, bukan serentak.</h3></div>
          <p className="max-w-[390px] text-[12px] leading-5 text-[#91a0a8]">Spesialisasi KontraktorAI mencakup lima sektor dalam tiga gelombang. Ekosistem pasarnya juga mencakup profesional serta mitra teknologi dan bisnis.</p>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {marketWaves.map((wave) => <article key={wave.number} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`market-wave-${wave.number}`}>
            <div className="font-mono text-[10px] text-[#8bdcff]">GELOMBANG {wave.number}</div>
            <h4 className="mt-2 text-[14px] font-semibold text-[#e1eaed]">{wave.title}</h4>
            <p className="mt-2 text-[11px] leading-5 text-[#91a0a8]">{wave.detail}</p>
          </article>)}
        </div>
      </div>
      <div className="border-t border-dashed border-white/10 py-7" data-testid="gustafta-industry-taxonomy-proposal">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><div className="eyebrow text-amber-100/90">TAKSONOMI GUSTAFTA · REKOMENDASI, BELUM FINAL</div><h3 className="display-font mt-3 text-2xl font-semibold text-[#e7eef1] md:text-3xl">Delapan kategori, satu ekosistem.</h3></div>
          <p className="max-w-[430px] text-[11px] leading-5 text-[#91a0a8]">Dokumen mengusulkan kategori pasar dan solusi yang saling terhubung. Lima sektor KontraktorAI tetap menjadi fokus inti yang sudah disetujui.</p>
        </div>
        <div className="mt-5 grid gap-2 lg:grid-cols-3">
          {taxonomyProposalGroups.map((group, index) => <article key={group.title} className="border border-white/[.1] bg-white/[.025] p-4" data-testid={`taxonomy-proposal-group-${index + 1}`}>
            <div className="font-mono text-[8px] leading-4 tracking-[.08em] text-[#8bdcff]">{group.label}</div>
            <h4 className="mt-2 text-[13px] font-semibold text-[#e1eaed]">{group.title}</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">{group.categories.map(category => <span key={category} className="border border-white/10 bg-[#101920] px-2 py-1 text-[9px] text-[#c2cdd2]">{category}</span>)}</div>
            <p className="mt-3 text-[10px] leading-5 text-[#91a0a8]">{group.detail}</p>
          </article>)}
        </div>
        <div className="mt-3 border-l-2 border-[#8bdcff]/55 bg-[#8bdcff]/[.04] px-4 py-3 text-[10px] leading-5 text-[#aab9c0]" data-testid="taxonomy-proposal-boundary">
          Kapabilitas lintas industri yang diusulkan: konsultasi AI, otomasi, AI Assistant/Concierge, pengembangan software, data intelligence, pengelolaan dokumen/knowledge, transformasi digital, dan pelatihan. Industri, solusi, produk, serta konten tetap entitas terpisah yang dihubungkan dalam master matrix; contoh produk bukan klaim ketersediaan.
        </div>
      </div>
      <div className="border-t border-white/10 pt-8">
        <div className="eyebrow">RUANG KEBUTUHAN DI DALAM EKOSISTEM</div>
      <div className="mt-2 grid md:grid-cols-2">
        {tracks.map((track, i) => {
          const Icon = track.icon;
          return <a key={track.name} href="#solusi" className="service-card group flex gap-4 border-b border-white/[.09] py-6 md:pr-8" data-testid={`link-track-${i}`}>
            <span className="grid h-10 w-10 shrink-0 place-items-center border border-white/10 bg-white/[.025] text-[#8bdcff]"><Icon size={17} /></span>
            <span className="flex-1"><span className="flex items-center justify-between"><strong className="text-[14px] font-semibold text-[#e2eaed]">{track.name}</strong><ArrowUpRight size={15} className="text-[#7f929c] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8bdcff]" /></span><span className="mt-1.5 block max-w-[420px] text-[12px] leading-5 text-[#91a0a8]">{track.detail}</span></span>
          </a>;
        })}
      </div>
      <p className="mt-4 text-[10px] leading-5 text-[#778991]" data-testid="text-ecosystem-tracks-note">Kategori ini memetakan area kebutuhan, bukan pernyataan bahwa layanan atau produk tertentu sudah tersedia.</p>
        <div className="mt-4 flex flex-col gap-2 border-l-2 border-[#8bdcff] bg-[#8bdcff]/[.055] px-4 py-3 sm:flex-row sm:items-center sm:justify-between" data-testid="market-ecosystem-audience">
          <span className="font-mono text-[9px] tracking-[.12em] text-[#8bdcff]">PASAR EKOSISTEM</span>
          <span className="text-[11px] leading-5 text-[#c3d0d6]">Profesional industri · mitra teknologi · mitra bisnis</span>
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
      <div><Brand light /><p className="mt-4 max-w-[365px] text-[12px] leading-6 text-[#91a0a8]">Portal solusi digital dan AI untuk UMKM kontraktor serta profesional industri Indonesia, sebagai brand vertikal Gustafta yang berfokus pada hasil nyata.</p></div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div><div className="eyebrow !text-[9px]">JELAJAHI</div><a href="#solusi" className="mt-4 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-solusi">Peta solusi</a><a href="#wawasan" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-wawasan">Wawasan</a></div>
        <div><div className="eyebrow !text-[9px]">EKOSISTEM</div><a href="#tentang" className="mt-4 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-ekosistem">Tentang portal</a><a href="#model-bisnis" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-model-bisnis">Arah model bisnis</a><a href="#cara-kerja" className="mt-3 block text-[12px] text-[#a9b6bd] hover:text-[#8bdcff]" data-testid="link-footer-cara-kerja">Cara kerja</a></div>
        <div className="col-span-2 sm:col-span-1"><div className="eyebrow !text-[9px]">UNTUK SIAPA</div><p className="mt-4 text-[12px] leading-5 text-[#a9b6bd]">Kontraktor UMKM<br />Konsultan konstruksi<br />Tenaga ahli & profesional</p></div>
      </div>
    </div>
      <div className="container-wide flex flex-col justify-between gap-3 border-t border-white/[.08] py-4 text-[10px] text-[#71818a] sm:flex-row"><span>© Gustafta · KontraktorAI · Portal solusi industri Indonesia</span><span>Konten informatif, bukan pengganti nasihat profesional.</span></div>
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
