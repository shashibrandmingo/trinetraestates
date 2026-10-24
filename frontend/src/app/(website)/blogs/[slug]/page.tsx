import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { blogsData, BlogPost } from "@/data/blogsData";
import RequirementForm from "@/components/forms/RequirementForm";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const post = blogsData.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Noida Office Spaces",
    };
  }

  const canonicalUrl = `https://officespaceinnoida.com/blogs/${slug}`;

  return {
    title: `${post.title} | Noida Office Spaces`,
    description: post.excerpt,
    keywords: [
      post.title,
      "best sector for office space in noida",
      "office space in Sector 62 Noida",
      "office space in Noida Expressway",
      "commercial office rent in Noida",
      "Noida commercial real estate",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Noida Office Spaces`,
      description: post.excerpt,
      url: canonicalUrl,
      siteName: "Noida Office Spaces",
      locale: "en_IN",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Noida Office Spaces`,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = params;
  const post = blogsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Structured Data (JSON-LD) for Google Search Rich Snippet & Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://officespaceinnoida.com/blogs/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        url: `https://officespaceinnoida.com/blogs/${post.slug}`,
        datePublished: "2026-10-24T00:00:00+05:30",
        dateModified: "2026-10-24T00:00:00+05:30",
        author: {
          "@type": "Person",
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          "@type": "Organization",
          name: "Noida Office Spaces",
          url: "https://officespaceinnoida.com",
          logo: {
            "@type": "ImageObject",
            url: "https://officespaceinnoida.com/favicon-96x96.png",
          },
        },
        image: `https://officespaceinnoida.com${post.coverImage}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://officespaceinnoida.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blogs",
            item: "https://officespaceinnoida.com/blogs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://officespaceinnoida.com/blogs/${post.slug}`,
          },
        ],
      },
      ...(post.faqs && post.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="min-h-screen bg-[var(--bg-main)] text-[var(--text-body)] pb-16 sm:pb-24">
      {/* ── JSON-LD Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── Breadcrumb Bar (Compact) ── */}
      <div className="border-b border-slate-200 bg-white py-2.5">
        <Container>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors no-underline">
              Home
            </Link>
            <i className="fa-solid fa-chevron-right text-[7.5px] text-gray-400" />
            <Link href="/blogs" className="hover:text-[var(--gold)] transition-colors no-underline">
              Blogs
            </Link>
            <i className="fa-solid fa-chevron-right text-[7.5px] text-gray-400" />
            <span className="text-[var(--gold)] font-medium truncate max-w-[200px] sm:max-w-none">
              {post.category}
            </span>
          </nav>
        </Container>
      </div>

      {/* ── Unified Editorial Article Container (Left: Content, Right: Sticky Form from Top) ── */}
      <div className="py-5 sm:py-8">
        <Container>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ── Left Column: Article Body (8 Cols) ── */}
            <main className="blog-editorial lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 lg:p-8 space-y-6">
              
              {/* Category Pill + Read Time */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)]/60">
                  {post.category}
                </span>
                <span className="text-[11.5px] text-[var(--text-muted)] flex items-center gap-1 font-normal">
                  <i className="fa-regular fa-clock text-[10px]" />
                  {post.readTime}
                </span>
              </div>

              {/* Main Article Title (H1) - Balanced, Authoritative & Luxury Editorial */}
              <h1 className="text-[21px] sm:text-[25px] lg:text-[28px] font-bold text-[#0a233c] leading-[1.24] tracking-tight">
                {post.title}
              </h1>

              {/* Sub-headline / Excerpt */}
              <p className="text-[13.5px] sm:text-[14.5px] text-[#475569] leading-relaxed font-normal">
                {post.excerpt}
              </p>

              {/* Author & Share Row (Compact) */}
              <div className="flex items-center justify-between gap-3 py-2.5 border-y border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--gold-bright)] flex items-center justify-center font-bold text-[11px] shadow-2xs shrink-0">
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="leading-tight">
                    <span className="block text-[12px] sm:text-[12.5px] font-semibold text-[#0a233c]">
                      {post.author.name}
                    </span>
                    <span className="block text-[10.5px] sm:text-[11px] text-[var(--text-muted)]">
                      {post.author.role} • {post.publishedAt}
                    </span>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <span className="hidden sm:inline text-[11px]">Share:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${post.title} - https://officespaceinnoida.com/blogs/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center no-underline"
                    aria-label="Share on WhatsApp"
                  >
                    <i className="fa-brands fa-whatsapp text-[11.5px]" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `https://officespaceinnoida.com/blogs/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition-all flex items-center justify-center no-underline"
                    aria-label="Share on LinkedIn"
                  >
                    <i className="fa-brands fa-linkedin-in text-[11.5px]" />
                  </a>
                </div>
              </div>

              {/* Featured Cover Image (Inside Content Column, NOT full-screen) */}
              <div className="relative aspect-[16/9] max-h-[260px] sm:max-h-[310px] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 750px"
                  className="object-cover object-center"
                />
              </div>

              {/* Intro paragraphs */}
              <div className="text-[14px] sm:text-[14.5px] leading-[1.72] text-[#334155] space-y-2.5">
                <p className="font-semibold text-[#0a233c] text-[14px] sm:text-[15px]">
                  Sector 62 or Expressway? Sector 125 or 142? If you are about to lease an office in Noida, the sector you pick will shape your rent, your hiring and your team&rsquo;s daily commute for years.
                </p>
                <p>
                  This guide helps you find the best sector for office space in Noida for your business. We compare the main business districts on rent, metro access, building quality and who each one suits, so you can shortlist with confidence.
                </p>
              </div>

              {/* ── Table 1: Quick Summary by Business Type (REAL TABLE WITH BORDERS) ── */}
              <div id="quick-summary" className="space-y-3 pt-2 scroll-mt-24">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                    <h2 className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#0a233c] tracking-tight">
                      Quick Summary: Best Sector by Business Type
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium sm:hidden flex items-center gap-1 shrink-0">
                    <i className="fa-solid fa-arrows-left-right text-[9px] text-[var(--gold)]" />
                    Swipe
                  </span>
                </div>
                
                {/* Styled Real Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs -mx-1 sm:mx-0">
                  <table className="w-full min-w-[560px] text-left border-collapse text-[12.5px] sm:text-[13px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[#0a233c]">
                        <th className="py-2.5 px-3.5 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider">If you are...</th>
                        <th className="py-2.5 px-3.5 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider whitespace-nowrap">Start with</th>
                        <th className="py-2.5 px-3.5 font-bold text-[11px] uppercase tracking-wider">Why</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-[#334155] font-medium">A startup or small team that needs metro access</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-[var(--gold)] whitespace-nowrap">Sector 62 / 63</td>
                        <td className="py-2.5 px-3.5 text-[#475569] leading-relaxed">Established IT hub, Blue Line metro, lots of food and co-working options</td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-[#334155] font-medium">A mid-size IT or corporate team wanting modern Grade A</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-[var(--gold)] whitespace-nowrap">Sector 125 / 126</td>
                        <td className="py-2.5 px-3.5 text-[#475569] leading-relaxed">Corporate corridor on the Noida Expressway</td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-[#334155] font-medium">A cost-conscious growing company near the Aqua Line</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-[var(--gold)] whitespace-nowrap">Sector 142</td>
                        <td className="py-2.5 px-3.5 text-[#475569] leading-relaxed">Newer buildings, Aqua Line metro access</td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-[#334155] font-medium">An enterprise wanting large floor plates and parking</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-[var(--gold)] whitespace-nowrap">Sector 132 / 135 / 136</td>
                        <td className="py-2.5 px-3.5 text-[#475569] leading-relaxed">Expressway-belt campuses and business parks</td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 text-[#334155] font-medium">A brand that needs visibility and walk-in clients</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-[var(--gold)] whitespace-nowrap">Sector 16 / 18 / Film City</td>
                        <td className="py-2.5 px-3.5 text-[#475569] leading-relaxed">Noida&rsquo;s central business district</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Average rents note callout */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#faf5ef] border-l-3 border-[var(--gold)] text-[12px] sm:text-[13px] text-[#475569] leading-relaxed">
                  <strong>Average rents by micro-market</strong> (Cushman &amp; Wakefield data via The Week, Nov 2025): Sector 16 and Film City about ₹110 to ₹112 per sq ft per month; Expressway belt about ₹67 to ₹69; Sector 62 about ₹61 to ₹63; Sectors 1 to 10 and 57 to 59 about ₹44 to ₹46; Noida average about ₹70 to ₹72. Rates are averages and vary by building.
                </div>
              </div>

              {/* Jump to Anchor Pills */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a233c] block mb-2">
                  Jump to Section:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { id: "how-to-choose", label: "How to Choose" },
                    { id: "sector-62-63", label: "Sector 62 & 63" },
                    { id: "sector-125-126", label: "Sector 125 & 126" },
                    { id: "sector-132-136", label: "Sector 132, 135 & 136" },
                    { id: "sector-142", label: "Sector 142" },
                    { id: "sector-16-18", label: "Sector 16, 18 & Film City" },
                    { id: "comparison-table", label: "Side-by-Side Table" },
                    { id: "common-mistakes", label: "Common Mistakes" },
                    { id: "checklist", label: "Checklist" },
                    { id: "faqs", label: "FAQs" },
                  ].map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 text-[11px] sm:text-[11.5px] text-[#0a233c] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors no-underline font-medium"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* ── Section 1: How to Choose ── */}
              <div id="how-to-choose" className="space-y-3 pt-3 scroll-mt-24 border-t border-slate-100">
                <h2 className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#0a233c] tracking-tight">
                  How to Choose an Office Location in Noida
                </h2>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569]">
                  No sector is &ldquo;best&rdquo; for everyone. Judge each one on five things:
                </p>
                <div className="space-y-2 text-[13px] sm:text-[13.5px] text-[#334155]">
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 leading-relaxed">
                    <strong className="text-[#0a233c]">1. Your team&rsquo;s commute:</strong> Map where your staff live. Sector 62 and 63 are strong for teams commuting on the Blue Line, while the Expressway belt works well if your team is spread towards Greater Noida and uses the Aqua Line.
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 leading-relaxed">
                    <strong className="text-[#0a233c]">2. Budget per sq ft:</strong> Work out rent for your area, then add CAM, parking, GST and deposit. A lower rent can still cost more once extras are added.
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 leading-relaxed">
                    <strong className="text-[#0a233c]">3. Building grade and amenities:</strong> Check lifts, power backup, parking, security and washrooms. Grade A buildings cost more but reduce day-to-day friction.
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 leading-relaxed">
                    <strong className="text-[#0a233c]">4. Talent pool and neighbourhood:</strong> Sectors with many IT and BPO companies make it easier to hire experienced people. Food courts, banks and cafes nearby matter more than most founders expect.
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/70 leading-relaxed">
                    <strong className="text-[#0a233c]">5. Room to grow:</strong> If you expect to double your team in 18 months, choose a building where you can take more floors or move to a larger unit without changing sectors.
                  </div>
                </div>
              </div>

              {/* ── Section 2: Sector 62 & 63 ── */}
              <div id="sector-62-63" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[#0a233c] tracking-tight">
                    Sector 62 and Sector 63: The Established IT Hub
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)] whitespace-nowrap">
                    ₹61 to ₹63 / sq ft
                  </span>
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569] leading-relaxed">
                  Sector 62 is Noida&rsquo;s best-known office address. It is home to many IT, ITES and consulting firms, and sits close to the Noida Electronic City Blue Line metro station. Sector 63 is right next door and often offers similar quality at a slightly different price.
                </p>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[12.5px] sm:text-[13px]">
                  <p><strong className="text-[#0a233c]">Rent:</strong> About ₹61 to ₹63 per sq ft per month on average (Cushman &amp; Wakefield). On portals, furnished offices of about 1,200 sq ft have been listed around ₹60,000 to ₹70,000 per month.</p>
                  <p><strong className="text-emerald-700">Best for:</strong> Startups, SMEs, agencies, BPO and IT teams that want metro access and a lively business neighbourhood.</p>
                  <p><strong className="text-amber-700">Watch out for:</strong> Older buildings with limited parking. Ask for a site visit during office hours.</p>
                  <p><strong className="text-[var(--gold)]">Tip:</strong> If you want to pay less than the Sector 62 average, compare Sector 63 buildings before you decide.</p>
                </div>
              </div>

              {/* ── Section 3: Sector 125 & 126 ── */}
              <div id="sector-125-126" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[#0a233c] tracking-tight">
                    Sector 125 and Sector 126: The Corporate Corridor
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)] whitespace-nowrap">
                    ₹67 to ₹69 / sq ft
                  </span>
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569] leading-relaxed">
                  These sectors sit on the Noida Expressway and are known for modern, larger business parks. They are popular with IT companies and enterprises that want a corporate campus feel.
                </p>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[12.5px] sm:text-[13px]">
                  <p><strong className="text-[#0a233c]">Rent:</strong> The Expressway belt averages about ₹67 to ₹69 per sq ft per month.</p>
                  <p><strong className="text-emerald-700">Best for:</strong> Mid-size and large IT or corporate teams that value Grade A buildings, parking and wide roads.</p>
                  <p><strong className="text-amber-700">Watch out for:</strong> Commute for teams based on the other side of Noida. Check your staff locations before signing.</p>
                </div>
              </div>

              {/* ── Section 4: Sector 132, 135 & 136 ── */}
              <div id="sector-132-136" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[#0a233c] tracking-tight">
                    Sector 132, 135 and 136: Expressway Business Parks
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)] whitespace-nowrap">
                    Expressway Belt
                  </span>
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569] leading-relaxed">
                  This stretch of the Expressway offers good road access, professional business parks and room for larger teams. Several providers also operate managed and co-working centres here.
                </p>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[12.5px] sm:text-[13px]">
                  <p><strong className="text-[#0a233c]">Rent:</strong> Within the Expressway average of about ₹67 to ₹69, with variation between older and newer towers. Sector 135 offers a more budget-friendly option within the belt.</p>
                  <p><strong className="text-emerald-700">Best for:</strong> Growing companies that need 50 to 100+ seats, ample parking and a modern environment without paying central business district rates.</p>
                  <p><strong className="text-[var(--gold)]">Tip:</strong> Ask which buildings are closest to a metro station, since walking distance can vary a lot along the Expressway.</p>
                </div>
              </div>

              {/* ── Section 5: Sector 142 ── */}
              <div id="sector-142" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[#0a233c] tracking-tight">
                    Sector 142: The Next-Generation Hub
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)] whitespace-nowrap">
                    Aqua Line Hub
                  </span>
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569] leading-relaxed">
                  Sector 142 is a newer corporate location with modern buildings, and is served by the Aqua Line metro. It is a good option for startups, mid-size firms and IT teams looking for newer Grade A buildings at competitive rates.
                </p>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[12.5px] sm:text-[13px]">
                  <p><strong className="text-emerald-700">Best for:</strong> Companies that want a fresh building, good access along the Expressway and a team that commutes from Greater Noida.</p>
                  <p><strong className="text-amber-700">Watch out for:</strong> Fewer food and retail options than Sector 62 in some pockets. Visit the area at lunchtime to judge it.</p>
                </div>
              </div>

              {/* ── Section 6: Sector 16, 18 & Film City ── */}
              <div id="sector-16-18" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[#0a233c] tracking-tight">
                    Sector 16, 18 and Film City: The Central Business District
                  </h2>
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] sm:text-[11px] font-bold bg-[#faf5ef] text-[var(--gold)] border border-[var(--gold-border)] whitespace-nowrap">
                    ₹110 to ₹112 / sq ft
                  </span>
                </div>
                <p className="text-[13.5px] sm:text-[14px] text-[#475569] leading-relaxed">
                  This is Noida&rsquo;s central commercial belt, with average rents of about ₹110 to ₹112 per sq ft per month, the highest in the city.
                </p>
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[12.5px] sm:text-[13px]">
                  <p><strong className="text-emerald-700">Best for:</strong> Media companies, brands, professional firms and businesses that need a high-visibility address and walk-in clients.</p>
                  <p><strong className="text-amber-700">Watch out for:</strong> Higher rent and tighter parking. Weigh the brand benefit against the cost.</p>
                </div>
              </div>

              {/* ── Table 2: Side-by-Side Comparison (REAL TABLE WITH BORDERS) ── */}
              <div id="comparison-table" className="space-y-3 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#0a233c] tracking-tight">
                    Side-by-Side Comparison of Noida Office Sectors
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium sm:hidden flex items-center gap-1 shrink-0">
                    <i className="fa-solid fa-arrows-left-right text-[9px] text-[var(--gold)]" />
                    Swipe
                  </span>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs -mx-1 sm:mx-0">
                  <table className="w-full min-w-[620px] text-left border-collapse text-[12.5px] sm:text-[13px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[#0a233c]">
                        <th className="py-2.5 px-3 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider">Sector</th>
                        <th className="py-2.5 px-3 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider whitespace-nowrap">Avg rent (per sq ft/mo)</th>
                        <th className="py-2.5 px-3 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider">Metro access</th>
                        <th className="py-2.5 px-3 font-bold border-r border-slate-200 text-[11px] uppercase tracking-wider">Best for</th>
                        <th className="py-2.5 px-3 font-bold text-[11px] uppercase tracking-wider">Budget level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-[#0a233c]">62 / 63</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-[var(--gold)] whitespace-nowrap">about ₹61 to ₹63</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Blue Line</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Startups, SMEs, IT, BPO</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-[#334155] text-[11px] font-medium">Mid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-[#0a233c]">125 / 126</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-[var(--gold)] whitespace-nowrap">about ₹67 to ₹69 (Expressway avg)</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Check per building</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Corporate and IT teams</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-[#334155] text-[11px] font-medium">Mid to high</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-[#0a233c]">132 / 135 / 136</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-[var(--gold)] whitespace-nowrap">about ₹67 to ₹69 (Expressway avg)</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Check per building</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Larger teams, business parks</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-[#334155] text-[11px] font-medium">Mid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-[#0a233c]">142</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-[var(--gold)] whitespace-nowrap">within Expressway range</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Aqua Line</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Startups, mid-size IT</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-[#334155] text-[11px] font-medium">Mid</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-[#0a233c]">16 / 18 / Film City</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 font-semibold text-[var(--gold)] whitespace-nowrap">about ₹110 to ₹112</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Strong</td>
                        <td className="py-2.5 px-3 border-r border-slate-200 text-[#475569]">Brands, media, professional firms</td>
                        <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-[#334155] text-[11px] font-medium">High</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] italic">
                  Note: metro access varies building by building. Always measure the actual walking distance from the building to the station.
                </p>
              </div>

              {/* ── Section 8: Common Mistakes ── */}
              <div id="common-mistakes" className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2 scroll-mt-24">
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm" />
                  <h2 className="text-[15px] sm:text-[16.5px] font-bold text-amber-950 tracking-tight">
                    Common Mistakes When Choosing a Sector
                  </h2>
                </div>
                <ul className="space-y-1.5 text-[12.5px] sm:text-[13px] text-amber-950/90">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">✕</span>
                    <span><strong>Choosing by rent alone.</strong> A cheaper sector can cost more in commute time and lost hires.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">✕</span>
                    <span><strong>Ignoring the commute map.</strong> Check where your team lives before you check prices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">✕</span>
                    <span><strong>Skipping an evening and weekday visit.</strong> Traffic, parking and lifts behave differently at 10 am than at 3 pm.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">✕</span>
                    <span><strong>Forgetting extras.</strong> CAM, GST, parking and deposit change the real cost.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 shrink-0">✕</span>
                    <span><strong>Not asking about expansion.</strong> Moving in 12 months is more costly than choosing a flexible building now.</span>
                  </li>
                </ul>
              </div>

              {/* ── Section 9: Location Checklist ── */}
              <div id="checklist" className="space-y-2.5 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-[var(--gold)] text-sm" />
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#0a233c] tracking-tight">
                    Office Location Checklist
                  </h2>
                </div>
                <p className="text-[12.5px] sm:text-[13px] text-[#475569]">
                  Copy this before you shortlist:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12.5px] sm:text-[13px] text-[#334155]">
                  {[
                    "Team commute mapped for current and planned hires",
                    "Walking distance to metro measured",
                    "Rent per sq ft and CAM compared across 3 buildings",
                    "Carpet vs built-up area confirmed",
                    "Parking slots for cars and bikes confirmed",
                    "Power backup and lifts checked",
                    "Food, bank and ATM access nearby",
                    "Option to expand to more floors or units",
                    "Ownership and property documents verified",
                    "Site visit done on a working weekday",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-emerald-600 font-bold shrink-0 text-[11px]">✓</span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section 10: FAQs ── */}
              <div id="faqs" className="space-y-3 pt-3 scroll-mt-24 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-circle-question text-[var(--gold)] text-sm" />
                  <h2 className="text-[16px] sm:text-[18px] font-bold text-[#0a233c] tracking-tight">
                    FAQs on the Best Sector for Office Space in Noida
                  </h2>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      q: "Which is the best sector for office space in Noida?",
                      a: "Sector 62 is the most popular choice for startups, SMEs and IT teams because of its Blue Line metro access and established ecosystem. Sectors 125, 132 and 142 suit larger or newer corporate teams. The best sector depends on your budget, team size and commute.",
                    },
                    {
                      q: "Is Sector 62 better than Sector 125 for an office?",
                      a: "Sector 62 is better for metro access, food options and a lively neighbourhood, and averages about ₹61 to ₹63 per sq ft. Sector 125 suits bigger corporate teams that want modern Expressway business parks, with rents around ₹67 to ₹69. Visit both before deciding.",
                    },
                    {
                      q: "Which Noida sector is cheapest for office space?",
                      a: "Sectors 1 to 10 and 57 to 59 have the lowest average rents, at about ₹44 to ₹46 per sq ft per month. Sectors like 135 and 142 are often more affordable within the Expressway belt. Always compare CAM and parking charges as well.",
                    },
                    {
                      q: "Which sector is best for IT companies in Noida?",
                      a: "Sectors 62 and 63 are the established IT and ITES hubs, while Sectors 125, 132 and 142 on the Expressway offer newer business parks. Choose based on your team's commute, building grade and the budget you have for rent and fit-out.",
                    },
                    {
                      q: "Is the Noida Expressway good for office space?",
                      a: "Yes. The Expressway belt offers modern buildings, larger floor plates, good parking and strong road access, with average rents of about ₹67 to ₹69 per sq ft per month. Check walking distance to the nearest metro station for each building you shortlist.",
                    },
                  ].map((faq, idx) => (
                    <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <h3 className="text-[13.5px] sm:text-[14px] font-semibold text-[#0a233c] mb-1.5 flex items-start gap-2">
                        <span className="text-[var(--gold)] font-bold">Q{idx + 1}.</span>
                        <span>{faq.q}</span>
                      </h3>
                      <p className="text-[12.5px] sm:text-[13.5px] text-[#475569] leading-relaxed pl-4">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Conclusion Box (High Contrast, Ultra Readable & Premium) ── */}
              <div className="blog-conclusion-card relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#07192b] via-[#0a233c] to-[#0d2d4d] border border-white/15 shadow-card space-y-3 overflow-hidden">
                {/* Decorative subtle gold accent glow on top edge */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--gold)]" />
                  <h2 className="text-[16px] sm:text-[18px] font-bold !text-white tracking-tight">
                    Conclusion: Pick the Sector That Fits Your Team, Not Just Your Budget
                  </h2>
                </div>
                
                <p className="text-[13px] sm:text-[14px] !text-[#f8fafc] leading-relaxed font-normal">
                  The best sector for office space in Noida is the one that matches your team&rsquo;s commute, your budget and your growth plans. Sector 62 and 63 are the safe, established choice. The Expressway belt gives you newer buildings and more room. Sector 142 is a strong value option, and the central business district is for brands that need visibility.
                </p>
                <p className="text-[12.5px] sm:text-[13px] !text-[#cbd5e1] leading-relaxed">
                  Shortlist two sectors, visit three buildings in each, and compare the full monthly cost, not just the rent.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/#contact"
                    className="px-4 sm:px-5 py-2.5 rounded-full bg-[var(--gold)] hover:bg-[var(--gold-hover)] !text-white text-[12px] sm:text-[12.5px] font-bold transition-all shadow-sm hover:shadow-gold flex items-center gap-1.5 no-underline"
                  >
                    <span>Share Your Requirements</span>
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                  <a
                    href="tel:+919999901196"
                    className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 !text-white text-[12px] sm:text-[12.5px] font-medium transition-all border border-white/20 flex items-center gap-1.5 no-underline"
                  >
                    <i className="fa-solid fa-phone text-[10px] text-[var(--gold-bright)]" />
                    <span>+91 99999 01196</span>
                  </a>
                </div>
              </div>

            </main>

            {/* ── Right Column: Sticky Sidebar with Global Requirement Form (4 Cols) ── */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="lg:sticky lg:top-20 space-y-4">
                
                {/* Global Requirement Form */}
                <div id="enquiry-form-card" className="rounded-2xl overflow-hidden shadow-card border border-slate-200/90 bg-white">
                  <RequirementForm
                    badge="OFFICE LEASING ADVISORY"
                    title="Find Office in Noida"
                    subtitle="Share your requirement for verified spaces with 0% brokerage."
                    buttonText="Get Office Options"
                    propertyName={`Blog: ${post.title}`}
                    propertyContext={{
                      sector: "Sector 62 / Expressway",
                    }}
                    initialData={{
                      area: "Sector 62",
                    }}
                    className="w-full shadow-none border-none p-4 sm:p-5"
                  />
                </div>

                {/* Table of Contents Quick Links */}
                {post.tableOfContents && post.tableOfContents.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
                      <i className="fa-solid fa-list-ul text-[10px] text-[var(--gold)]" />
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#0a233c]">
                        Table of Contents
                      </span>
                    </div>
                    <ul className="space-y-1 text-[11.5px] text-[#475569]">
                      {post.tableOfContents.map((toc) => (
                        <li key={toc.id}>
                          <a
                            href={`#${toc.id}`}
                            className="hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 line-clamp-1 py-0.5 no-underline hover:no-underline"
                          >
                            <span className="text-[var(--gold)] text-[9px]">›</span>
                            <span>{toc.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </div>
    </article>
  );
}
