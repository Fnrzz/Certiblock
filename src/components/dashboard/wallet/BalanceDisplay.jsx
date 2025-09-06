"use client";

import { useAccount, useBalance, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Button from "../../ui/button/Button";
import DisconnectButton from "./DisconnectButton";

export default function BalanceDisplay() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { data: nativeBalance, isLoading } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: injected() })}
        size="sm"
        className="w-full"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="w-full text-gray-600 dark:text-gray-200">
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className="w-full ">
          <div className="flex justify-between">
            <span>Address :</span>
            <span>{address?.slice(0, 20) + "..." + address?.slice(-4)}</span>
          </div>
          <div className="flex justify-between">
            <span>Balance :</span>
            <span>
              {parseFloat(nativeBalance?.formatted).toFixed(4)}{" "}
              {nativeBalance?.symbol}
            </span>
          </div>
          <DisconnectButton />
        </div>
      )}
    </div>
  );
}
