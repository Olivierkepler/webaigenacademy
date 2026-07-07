import type { ComponentType } from "react";

export type VisualizationId = string;

export type VisualizationDefinition = {
  id: string;
  title: string;
  description: string;
  component: ComponentType;
};
