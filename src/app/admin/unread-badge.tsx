"use client";

import { useEffect, useState } from "react";

export function UnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/submissions?count_unread=1");
        if (!res.ok) return;
        const data = await res.json();
        if (active && typeof data.unread === "number") {
          setCount(data.unread);
        }
      } catch {}
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-yellow px-1.5 py-0.5 font-mono text-[10px] font-black text-on-yellow">
      {count}
    </span>
  );
}
