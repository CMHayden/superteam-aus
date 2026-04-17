"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqCardRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20"
      aria-labelledby="faq-heading"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p className="mb-2 font-mono text-xs font-extrabold uppercase tracking-widest text-brand-yellow">
          FAQ
        </p>
        <h2
          id="faq-heading"
          className="mb-10 font-display text-4xl font-black leading-tight text-text-primary md:text-5xl"
        >
          <span className="text-brand-green">All the</span>{" "}
          <span className="text-brand-yellow">answers</span>
        </h2>

        <div
          ref={faqCardRef}
          data-beam-collision-target
          className="overflow-hidden rounded-2xl border border-brand-green/45 bg-surface-card"
        >
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className={cn(
                  "border-brand-green/35",
                  index < faqs.length - 1 && "border-b",
                )}
              >
                <h3>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-green/10 md:px-6"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-body text-sm font-extrabold uppercase tracking-wide text-text-primary md:text-base">
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center justify-center text-brand-green transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  className={cn(
                    "grid transition-all duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 font-body text-sm font-bold leading-relaxed text-text-secondary md:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
