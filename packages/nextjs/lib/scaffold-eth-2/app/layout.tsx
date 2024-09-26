import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "@scaffold-eth-2/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "@scaffold-eth-2/components/ThemeProvider";
import "@scaffold-eth-2/styles/globals.css";
import { getMetadata } from "@scaffold-eth-2/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Scaffold-ETH 2 App",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
