import LessonSection from "./LessonSection";
import { getVisualizationById } from "@/app/visualizations/registry";

type LessonVisualizationsProps = {
  visualizations: string[];
};

export default function LessonVisualizations({
  visualizations,
}: LessonVisualizationsProps) {
  if (visualizations.length === 0) {
    return null;
  }

  return (
    <>
      {visualizations.map((id) => {
        const definition = getVisualizationById(id);

        if (!definition) {
          return null;
        }

        const { title, description, component: Component } = definition;

        return (
          <LessonSection
            key={id}
            label="Interactive"
            title={title}
            description={description}
          >
            <Component />
          </LessonSection>
        );
      })}
    </>
  );
}
