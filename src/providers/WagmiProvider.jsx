"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, sepolia, polygonAmoy } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Konfigurasi untuk wagmi, menentukan jaringan yang didukung
export const config = createConfig({
  chains: [mainnet, sepolia, polygonAmoy], // Anda bisa menambahkan jaringan lain seperti polygon, bsc, dll.
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
