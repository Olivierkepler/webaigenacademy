export type LessonVideo = {
  provider: "google-drive" | "youtube";
  id: string;
  title: string;
  description?: string;
  aspect?: "16/9" | "16/10";
  thumbnail?: string;
};

/** Default video shown in the lesson rightbar when a lesson has no video of its own. */
export const lessonVideo: LessonVideo = {
  provider: "google-drive",
  id: "1trXDnqKx5DAHOXPAvLV_r7KYqXx0Pxtl",
  title: "How to create a new project",
  description:
    "This video shows you how to create a new project in the project management tool.",
};
