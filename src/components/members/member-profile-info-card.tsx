export function MemberProfileInfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-brand-green/35 bg-surface-card p-5">
      <h2 className="font-display text-2xl font-black text-brand-green">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
            <span className="mt-2 size-1.5 rounded-full bg-brand-yellow" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
