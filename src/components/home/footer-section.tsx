import Link from "next/link";
import { SuperteamLogo } from "@/components/superteam-logo";
import { getSiteConfig, getSocialLinks } from "@/lib/cms";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Members", href: "/members" },
  { label: "What we do", href: "#what-we-do-heading" },
  { label: "Community", href: "#community-heading" },
  { label: "Events", href: "#events-heading" },
  { label: "FAQ", href: "#faq-heading" },
];

export async function FooterSection() {
  const [siteConfig, socialLinks] = await Promise.all([
    getSiteConfig("footer_description"),
    getSocialLinks(),
  ]);

  const description =
    siteConfig.footer_description ||
    "A high-signal community helping Australian builders, founders, creatives, and operators thrive in the Solana ecosystem.";

  return (
    <footer className="relative overflow-hidden border-t border-brand-green/35 bg-surface-nav px-4 py-12 md:px-8 md:py-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="inline-flex items-center rounded-lg border border-brand-green/35 bg-surface-card/70 px-4 py-3">
            <SuperteamLogo className="inline-flex items-center gap-2.5" />
          </div>
          <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
          <a
            href="https://superteam.fun"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-green/35 bg-brand-green/10 px-4 py-2 font-body text-xs font-black uppercase tracking-wide text-brand-green transition-colors hover:border-brand-green/55 hover:bg-brand-green/15"
          >
            Visit global Superteam
          </a>
        </div>

        <div className="md:col-span-3">
          <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-green">Navigation</p>
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-body text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:col-span-4">
          <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-green">Socials</p>
          <div className="flex flex-col gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-lg border border-border-yellow bg-surface-card/70 px-3 py-2 font-body text-sm font-bold text-text-secondary transition-colors hover:border-border-yellowhi hover:text-text-primary"
              >
                <span>{item.platform}</span>
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
