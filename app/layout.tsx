import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Navbar from "./components/Nabar";
import { ThemeProvider } from "./components/ThemeProvider";
import UserMenu from "./components/auth/UserMenu";
import AuthSessionProvider from "./components/auth/AuthSessionProvider";
import { getSiteUrl } from "@/app/lib/siteUrl";
import { lessons } from "@/data/lessons";
import { getPublishedLearningCourses } from "@/lib/learning";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "WebAIGen Academy",
  description: "Interactive machine learning lessons with browser-based practice labs.",
  icons: {
    icon: "/images/favicon_32_black.png",
    shortcut: "/images/favicon_32_black.png",
    apple: "/images/favicon_32_black.png",
  },
};

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem("theme");
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      document.documentElement.classList.add("dark");
    }
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const databaseCourses = await getPublishedLearningCourses();

  const filesystemSearchableLessons = lessons.map((lesson) => ({
    course: lesson.course,
    slug: lesson.slug,
    title: lesson.title,
    order: lesson.order,
    section: lesson.section,
    description: lesson.description,
    duration: lesson.duration,
    content: lesson.content,
    quiz: lesson.quiz,
  }));

  const databaseSearchableLessons = databaseCourses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      course: course.slug,
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.position,
      section: lesson.section ?? course.title,
      description: lesson.description ?? "",
      duration: lesson.duration ?? "Self-paced",
      content: lesson.content ?? "",
    }))
  );

  const searchableLessons = [
    ...filesystemSearchableLessons,
    ...databaseSearchableLessons,
  ];
  return (
    <html
      lang="en"
      className={`dark ${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${inter.className} min-h-full flex flex-col font-body`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <AuthSessionProvider>
          <Navbar
            searchableLessons={searchableLessons}
            userMenu={<UserMenu />}
          />

          <div className="pt-[var(--navbar-height)]">
            {children}
          </div>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
