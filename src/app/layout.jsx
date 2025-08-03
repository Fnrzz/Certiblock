import { Outfit } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import Web3Provider from "@/providers/WagmiProvider";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "CertiBlock",
  description: "Official platform for creating certificates with blockchain",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/logo/logo-icon-light.png",
        type: "image/png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/logo/logo-icon-dark.png",
        type: "image/png",
      },
    ],
    shortcut: "/images/logo/logo-icon-dark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <Web3Provider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
