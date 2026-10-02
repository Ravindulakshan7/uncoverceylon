import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, Compass, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — UncoverCeylon | Serandib Co.',
  description:
    'Read the Terms of Service for UncoverCeylon, a digital initiative by Serandib Co. Guidelines on travel advisory information, cultural respect, and platform usage.',
};

export default function TermsOfServicePage() {
  const lastUpdated = 'October 2, 2026';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* ━━━ HERO HEADER ━━━ */}
      <section className="relative bg-[#07111e] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-[#07111e]/90 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md mx-auto block w-fit">
            <FileText className="w-3.5 h-3.5" />
            <span>Serandib Co. Legal Terms</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Clear, transparent guidelines for using the UncoverCeylon travel guide platform.
          </p>

          <p className="text-[12px] text-slate-500 font-mono">
            Last Updated: {lastUpdated} · Version 2.2
          </p>
        </div>
      </section>

      {/* ━━━ TERMS CONTENT ━━━ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-12 leading-relaxed text-slate-700 text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Acceptance of Agreement
              </h2>
            </div>
            <p>
              By accessing, browsing, or utilizing <strong>UncoverCeylon</strong> (the &quot;Platform&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. The Platform is owned, developed, and operated under <strong>Serandib Co.</strong>, an independent digital tourism initiative registered in Sri Lanka.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Informational & Travel Advisory Disclaimer
              </h2>
            </div>
            <p>
              UncoverCeylon is designed as a free, open educational and exploratory travel resource. While our team and local partners make every reasonable effort to verify information:
            </p>
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-amber-900 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Important Traveler Notice:</span>
              </div>
              <p>
                Ticket admission prices, national park safari schedules, train timetables (e.g. Sri Lanka Railways), weather seasonality windows, and temple access hours are subject to change without notice by local governing bodies, monsoon conditions, or Department of Wildlife Conservation (DWC) directives.
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Travelers are strongly advised to exercise personal discretion, verify critical schedules locally, and adhere to official Sri Lanka Tourism Development Authority (SLTDA) travel advisories.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Cultural Respect & Ethical Exploration
              </h2>
            </div>
            <p>
              Sri Lanka possesses thousands of years of sacred heritage, living Buddhist, Hindu, Muslim, and Christian spiritual traditions, and delicate biological diversity:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Sacred Sites Dress Code:</strong> When visiting historic temples and religious ruins (e.g., Sigiriya, Temple of the Tooth, Anuradhapura, Dambulla), visitors must wear clothing covering shoulders and knees, remove footwear and headgear, and refrain from posing disrespectfully with religious statues.
              </li>
              <li>
                <strong>Wildlife Ethics:</strong> Do not feed wild elephants, monkeys, or marine turtles. Maintain respectful distance and adhere to licensed safari jeep guidelines in national parks.
              </li>
              <li>
                <strong>Leave No Trace:</strong> Pack out all plastic waste and garbage, particularly when hiking Knuckles, Ella Rock, or remote waterfalls.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                User Reviews & Community Standards
              </h2>
            </div>
            <p>
              When submitting traveler reviews or stories:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-xs sm:text-sm">
              <li>You agree that your feedback is based on genuine first-hand travel experience.</li>
              <li>You will not submit defamatory, abusive, racially hateful, or commercially promotional spam content.</li>
              <li>Serandib Co. reserves the right to moderate, unpublish, or delete reviews that violate community standards.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Intellectual Property
              </h2>
            </div>
            <p>
              The visual branding, code, and curated editorial text on UncoverCeylon are proprietary works of Serandib Co. Destination photographs are used under open license or provided by contributing community creators. You may not scrape, republish, or commercialize platform content without written permission.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Inquiries & Legal Contact
              </h2>
            </div>
            <p>
              For legal inquiries, partnership opportunities, or corrections to published guides:
            </p>
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 text-sm space-y-2">
              <p><strong>Serandib Co. Legal & Community Relations</strong></p>
              <p className="text-slate-600">Email: <a href="mailto:legal@serandib.co" className="text-sky-600 font-semibold hover:underline">legal@serandib.co</a> / <a href="mailto:hello@uncoverceylon.com" className="text-sky-600 font-semibold hover:underline">hello@uncoverceylon.com</a></p>
              <p className="text-slate-600">Colombo, Sri Lanka</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
