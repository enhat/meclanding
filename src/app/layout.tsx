import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import ClickSpark from "@/components/click-spark";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Madden Electrochemical Consulting",
  description: "Madden Electrochemical Consulting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          roboto.className,
          "overflow-x-hidden w-full min-w-[320px]",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClickSpark
            sparkColor="#3b3b3b"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={250}
          >
            {" "}
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <footer className="w-full bg-primary-foreground flex flex-col items-center justify-end p-12 gap-12">
                <Separator />
                <span>
                  © 2025 Madden Electrochemical Consulting and/or its
                  affiliates. All rights reserved.
                </span>
              </footer>
            </div>
          </ClickSpark>
        </ThemeProvider>
      </body>
    </html>
  );
}
