"use client";

import Button from "@/components/ui/button/Button";
import { useDisconnect } from "wagmi";

export default function DisconnectButton() {
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => disconnect()}
      size="sm"
      className={
        "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 mt-4 w-full"
      }
    >
      Disconnect Wallet
    </Button>
  );
}
