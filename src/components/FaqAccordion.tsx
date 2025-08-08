"use client";

import { useRef, useState, type ReactNode } from "react";

export type FaqItem = {
  question: string;
  answer: ReactNode;
};

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement)[]>([]);


  const toggle = (idx: number) => {
    setOpenIndex((curr) => (curr === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.question} className="bg-gray-50 dark:bg-gray-800 rounded-lg">
          <button
            type="button"
            onClick={() => toggle(idx)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
            id={`faq-title-${idx}`}
          >
            <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            id={`faq-panel-${idx}`}
            role="region"
            aria-labelledby={`faq-title-${idx}`}
            className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{
              maxHeight: openIndex === idx ? `${contentRefs.current[idx]?.scrollHeight ?? 0}px` : 0,
            }}
          >
            <div
              ref={(el) => {contentRefs.current[idx] = el!}}
              className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

