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
