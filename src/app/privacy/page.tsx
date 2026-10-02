import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Globe, Eye, Server, Cookie, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — UncoverCeylon | Serandib Co.',
  description:
    'Read the Privacy Policy for UncoverCeylon, a digital initiative by Serandib Co. Learn how we safeguard your data, respect GDPR rights, and ensure transparent travel guide privacy.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Serandib Co. Digital Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Your trust matters. Learn how UncoverCeylon protects your privacy while exploring Sri Lanka.
          </p>

          <p className="text-[12px] text-slate-500 font-mono">
            Last Updated: {lastUpdated} · Version 2.4
          </p>
        </div>
      </section>

      {/* ━━━ POLICY CONTENT ━━━ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-sm space-y-12 leading-relaxed text-slate-700 text-sm sm:text-base">
          
          {/* Section 1 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Introduction & Our Commitment
              </h2>
            </div>
            <p>
              UncoverCeylon (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) is an open-access tourism initiative developed and maintained by <strong>Serandib Co.</strong>, based in Colombo, Sri Lanka. We believe travel information should be freely accessible without invasive surveillance or unnecessary data harvesting.
            </p>
            <p>
              This Privacy Policy explains what limited information we collect when you visit our website, how that data is used, and how we uphold global privacy standards, including the European Union General Data Protection Regulation (<strong>GDPR</strong>) and Sri Lanka&apos;s Personal Data Protection Act (PDPA).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Information We Collect
              </h2>
            </div>
            <p>
              We operate on a privacy-first model where <strong>no account registration is required</strong> to browse destinations, view maps, or download guides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Saved Wishlists & Favorites:</strong> Your saved destinations are stored entirely within your browser&apos;s local storage (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded text-sky-800">localStorage</code>). We do not transmit or store your personal wishlist on external servers.
              </li>
              <li>
                <strong>User Reviews & Feedback:</strong> When you voluntarily submit a traveler review, we collect your display name, numerical rating, and written feedback. We do not require your email address or phone number to post reviews.
              </li>
              <li>
                <strong>Geolocation Data:</strong> When using the interactive map or nearby radius search, your browser may ask for your location. This GPS data is processed ephemerally on your device to calculate driving distances and is never saved to our database.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Cookies & Translation Preferences
              </h2>
            </div>
            <p>
              We use minimal, functional cookies necessary to deliver site features:
            </p>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Functional Language Cookies (<code className="text-xs text-sky-700">googtrans</code>)</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    When you toggle between English, German, Russian, or French, a cookie stores your chosen language so you don&apos;t have to re-select it on every page.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              We do not employ cross-site tracking cookies, behavioral ad networks, or data broker pixels.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                GDPR Rights for International Visitors
              </h2>
            </div>
            <p>
              If you reside in the European Economic Area (EEA), the United Kingdom, or Switzerland, you enjoy full rights regarding your data:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 text-sm mb-1">Right to Access & Portability</strong>
                Request a copy of any review or data associated with your name.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 text-sm mb-1">Right to Erasure (Be Forgotten)</strong>
                Request immediate removal of any review or comment you posted.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 text-sm mb-1">Right to Rectification</strong>
                Correct any inaccurate travel feedback or guide detail.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 text-sm mb-1">No Data Selling Guarantee</strong>
                We never monetize, sell, or rent user data to third parties.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Third-Party Integrations
              </h2>
            </div>
            <p>
              To provide interactive satellite maps and high-resolution photography, we interface with trusted infrastructure providers:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-xs sm:text-sm">
              <li><strong>OpenStreetMap & Leaflet:</strong> Open-source vector cartography rendered in your browser.</li>
              <li><strong>Google Maps Navigation:</strong> Direct external links to launch directions on your device.</li>
              <li><strong>Google Translate API:</strong> On-the-fly multi-language translation.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                6
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Contact & Data Protection Officer
              </h2>
            </div>
            <p>
              If you have any questions about this Privacy Policy, wish to request removal of a review, or need assistance, please contact Serandib Co.:
            </p>
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-5 text-sm space-y-2">
              <p><strong>Serandib Co. — Digital Tourism Initiative</strong></p>
              <p className="text-slate-600">Email: <a href="mailto:privacy@serandib.co" className="text-sky-600 font-semibold hover:underline">privacy@serandib.co</a> / <a href="mailto:hello@uncoverceylon.com" className="text-sky-600 font-semibold hover:underline">hello@uncoverceylon.com</a></p>
              <p className="text-slate-600">Address: Colombo, Western Province, Sri Lanka</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
