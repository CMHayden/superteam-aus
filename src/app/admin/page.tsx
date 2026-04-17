import Link from "next/link";

const sections = [
  { label: "Stats", href: "/admin/stats", description: "Set the number for each stat counter" },
  { label: "Partners", href: "/admin/partners", description: "Manage partner logos, descriptions, and links" },
  { label: "What We Do", href: "/admin/what-we-do", description: "Edit the 6 mission cards" },
  { label: "Testimonials", href: "/admin/testimonials", description: "Manage testimonial quotes and images" },
  { label: "Tweets", href: "/admin/tweets", description: "Add or remove featured tweets" },
  { label: "Join Section", href: "/admin/join", description: "Edit join text, perks, and social links" },
  { label: "Join Form", href: "/admin/join-form", description: "Configure roles, locations, skills, and form options" },
  { label: "Submissions", href: "/admin/submissions", description: "View and manage join application submissions" },
  { label: "Carousel Images", href: "/admin/carousel", description: "Manage the rotating image slideshow" },
  { label: "Community Members", href: "/admin/community-members", description: "Set which members appear in the carousel" },
  { label: "FAQs", href: "/admin/faqs", description: "Add, edit, or delete FAQ items" },
  { label: "Footer", href: "/admin/footer", description: "Edit footer text and social links" },
  { label: "Insights", href: "/admin/insights", description: "Visualise community and applicant data" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl font-black text-text-primary">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-text-muted">
        Manage all site content from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border border-brand-green/25 bg-surface-card p-5 transition-colors hover:border-brand-green/50 hover:bg-surface-hover"
          >
            <h2 className="font-display text-lg font-black text-brand-green group-hover:text-brand-yellow transition-colors">
              {section.label}
            </h2>
            <p className="mt-1 font-body text-sm text-text-muted">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
