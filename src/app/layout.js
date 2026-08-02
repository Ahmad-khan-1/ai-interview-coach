import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "AI Interview Prep Coach",
  description:
    "Upload your resume and job description to get personalized interview questions, practice your answers, and receive instant AI feedback.",
  keywords: [
    "interview prep",
    "AI interview coach",
    "mock interview",
    "resume",
    "job interview practice",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "AI Interview Prep Coach",
    description:
      "Personalized interview practice powered by AI — upload your resume, practice, and get instant feedback.",
    url: "https://your-live-domain.vercel.app",
    siteName: "AI Interview Coach",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Interview Prep Coach",
    description: "Personalized interview practice powered by AI.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  themeColor: "#140F1F",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: "var(--color-accent)",
          colorBackground: "var(--color-surface)",
          colorText: "var(--color-text-primary)",
          colorTextSecondary: "var(--color-text-muted)",
          colorTextOnPrimaryBackground: "#FFFFFF",
          colorInputBackground: "var(--color-bg)",
          colorInputText: "var(--color-text-primary)",
          colorNeutral: "var(--color-text-primary)",
          borderRadius: "1rem",
        },
        elements: {
          headerTitle: { color: "var(--color-text-primary)" },
          headerSubtitle: { color: "var(--color-text-muted)" },
          dividerText: { color: "var(--color-text-muted)" },
          dividerLine: {
            backgroundColor: "var(--color-text-muted)",
            opacity: 0.3,
          },
          formFieldLabel: { color: "var(--color-text-primary)" },
          footerActionText: { color: "var(--color-text-muted)" },
          socialButtonsBlockButtonText: { color: "var(--color-text-primary)" },
          socialButtonsBlockButton: {
            backgroundColor: "var(--color-bg)",
            border:
              "1px solid color-mix(in srgb, var(--color-text-muted) 30%, transparent)",
          },
          lastAuthenticationStrategyBadge: {
            color: "var(--color-text-primary)",
            backgroundColor:
              "color-mix(in srgb, var(--color-text-muted) 20%, transparent)",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
