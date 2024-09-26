import { ScaffoldStarkAppWithProviders } from "@scaffold-stark-2/components/ScaffoldStarkAppWithProviders";
import { ThemeProvider } from "@scaffold-stark-2/components/ThemeProvider";
import "@scaffold-stark-2/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scaffold-Stark",
  description: "Fast track your starknet journey",
  icons: "/logo.ico",
};

const ScaffoldStarkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldStarkAppWithProviders>{children}</ScaffoldStarkAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldStarkApp;
