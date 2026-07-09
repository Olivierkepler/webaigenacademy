import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import Navbar from "./components/Nabar";
import { ThemeProvider } from "./components/ThemeProvider";
import Footer from "./components/footer";
import { lessons } from "@/data/lessons";

const searchableLessons = lessons.map((lesson) => ({
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col font-body`}>
        <ThemeProvider>
          <Navbar searchableLessons={searchableLessons} />
          {children}
        
        </ThemeProvider>
      </body>
    </html>
  );
}
