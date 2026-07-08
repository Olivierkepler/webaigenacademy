import LessonSection from "./LessonSection";
import { accent, typography } from "@/app/lib/typography";

type KeyTakeawaysProps = {
  takeaways: string[];
};

export default function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  return (
    <LessonSection label="Summary" title="Key Takeaways">
      <ul className="space-y-4">
        {takeaways.map((takeaway) => (
          <li key={takeaway} className={`flex gap-3 ${typography.reading}`}>
            <span
              aria-hidden
              className={`mt-2.5 h-2 w-2 shrink-0 rounded-full ${accent.bg}`}
            />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </LessonSection>
  );
}
