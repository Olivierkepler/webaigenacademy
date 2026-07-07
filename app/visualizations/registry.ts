import GiniCalculator from "@/app/components/GiniCalculator";
import WeightedGiniCalculator from "@/app/components/WeightedGiniCalculator";
import ThresholdSplitDemo from "@/app/components/ThresholdSplitDemo";
import BestSplitFinder from "@/app/components/BestSplitFinder";
import RandomForestVotingDemo from "@/app/components/RandomForestVotingDemo";
import type { VisualizationDefinition } from "./types";

export const visualizationRegistry: VisualizationDefinition[] = [
  {
    id: "gini-calculator",
    title: "Gini Impurity Calculator",
    description:
      "Adjust class counts to see how Gini impurity changes for a two-class split.",
    component: GiniCalculator,
  },
  {
    id: "weighted-gini-calculator",
    title: "Weighted Gini Split Calculator",
    description:
      "Compare left and right child groups to see how weighted Gini combines impurity across a split.",
    component: WeightedGiniCalculator,
  },
  {
    id: "threshold-split-demo",
    title: "Threshold Split Demo",
    description:
      "Change the feature and threshold to see how the dataset splits and how weighted Gini updates.",
    component: ThresholdSplitDemo,
  },
  {
    id: "best-split-finder",
    title: "Best Split Finder",
    description:
      "Compare every candidate split and see which threshold gives the lowest weighted Gini.",
    component: BestSplitFinder,
  },
  {
    id: "random-forest-voting-demo",
    title: "Random Forest Voting Demo",
    description:
      "Toggle each tree's prediction and see how majority voting determines the forest's final class.",
    component: RandomForestVotingDemo,
  },
];

export function getVisualizationById(
  id: string
): VisualizationDefinition | undefined {
  return visualizationRegistry.find((definition) => definition.id === id);
}
