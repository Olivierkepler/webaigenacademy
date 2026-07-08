import type { ReactNode } from "react";
import { cardPadding, typography } from "@/app/lib/typography";

type LessonSectionProps = {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function LessonSection({
  label,
  title,
  description,
  children,
}: LessonSectionProps) {
  return (
    <section className={cardPadding}>
      <p className={typography.label}>{label}</p>
      <h2 className={`mt-3 ${typography.sectionTitle}`}>{title}</h2>
      {description && (
        <p className={`mt-4 max-w-3xl ${typography.body}`}>{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
