"use client";

import Link from "next/link";
import { ReactNode } from "react";

type ToolBadgeTone = "blue" | "green" | "amber" | "rose" | "slate";

type ToolBadge = {
  label: string;
  tone?: ToolBadgeTone;
};

type ToolPageShellProps = {
  breadcrumbs: string[];
  icon: string;
  title: string;
  description: string;
  badges?: ToolBadge[];
  children: ReactNode;
};

type ToolPanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
};

const badgeToneClasses: Record<ToolBadgeTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-600",
  slate: "bg-slate-100 text-slate-600",
};

export function ToolPageShell({
  breadcrumbs,
  icon,
  title,
  description,
  badges = [],
  children,
}: ToolPageShellProps) {
  return (
    <div className="bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-[var(--muted)]">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-center gap-2">
                {index > 0 ? <span className="opacity-40">›</span> : null}
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </nav>

        <section className="rounded-[32px] border border-[var(--card-border)] bg-[var(--card)] px-5 py-6 shadow-[0_24px_64px_-36px_rgba(15,23,42,0.18)] backdrop-blur md:px-8 md:py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-2xl shadow-sm dark:border-blue-900 dark:bg-blue-950">
                {icon}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
                  {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                  {description}
                </p>
              </div>
            </div>

            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2 md:justify-end">
                {badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      badgeToneClasses[badge.tone ?? "slate"]
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}

export function ToolPanel({ title, description, children, className = "" }: ToolPanelProps) {
  return (
    <section
      className={`rounded-[28px] border border-[var(--card-border)] bg-[var(--card)] p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.22)] md:p-6 ${className}`}
    >
      {title ? (
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function EmptyToolState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-[var(--card-border)] bg-[var(--muted-bg)] px-6 py-10 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{description}</p>
    </div>
  );
}

type FaqItem = {
  question: string;
  answer: string;
};

type ToolFaqSectionProps = {
  title: string;
  description?: string;
  items: FaqItem[];
};

export function ToolFaqSection({ title, description, items }: ToolFaqSectionProps) {
  return (
    <ToolPanel title={title} description={description}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <details
            key={item.question}
            className={`group overflow-hidden rounded-2xl border ${
              index === 0
                ? "border-blue-200 bg-blue-50/70 dark:border-blue-800 dark:bg-blue-950/50"
                : "border-[var(--card-border)] bg-[var(--card)]"
            }`}
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="text-sm font-semibold text-[var(--foreground)] md:text-base">
                Q. {item.question}
              </span>
              <span className="text-xs text-[var(--muted)] transition group-open:rotate-180">▼</span>
            </summary>
            <div className="border-t border-[var(--card-border)] px-5 py-4 text-sm leading-6 text-[var(--muted)]">
              A. {item.answer}
            </div>
          </details>
        ))}
      </div>
    </ToolPanel>
  );
}

type RelatedToolItem = {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
};

type RelatedToolsSectionProps = {
  title: string;
  description?: string;
  items: RelatedToolItem[];
  actionLabel: string;
};

export function RelatedToolsSection({
  title,
  description,
  items,
  actionLabel,
}: RelatedToolsSectionProps) {
  return (
    <section>
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)] md:text-2xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[128px] flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_50px_-34px_rgba(37,99,235,0.22)] dark:hover:border-blue-700"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted-bg)] text-lg">
                {item.icon}
              </span>
              <span className="rounded-md bg-[var(--muted-bg)] px-2 py-1 text-[11px] font-semibold text-[var(--muted)]">
                {item.badge}
              </span>
            </div>
            <div className="mt-4 flex-1">
              <h3 className="text-sm font-semibold text-[var(--foreground)] md:text-base">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm font-semibold text-blue-600 dark:text-blue-400">
              <span>{actionLabel}</span>
              <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
