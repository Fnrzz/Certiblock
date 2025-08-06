import { config } from "@/providers/WagmiProvider";
import { getAccount } from "wagmi/actions";
import { addAdminOnChain, removeAdminOnChain } from "../blockchain/contract";

export const addAdminWallet = async (walletAddress) => {
  try {
    const account = getAccount(config);
    if (!account.isConnected) {
      throw new Error(
        "Wallet not connected. Please connect your wallet first."
      );
    }

    if (!walletAddress) {
      throw new Error("Alamat Wallet harus diisi.");
    }

    const txHash = await addAdminOnChain(walletAddress);

    return {
      status: "SUCCESS",
      transactionHash: txHash,
    };
  } catch (error) {
    throw error;
  }
};

export const removeAdminWallet = async (walletAddress) => {
  try {
    const account = getAccount(config);
    if (!account.isConnected) {
      throw new Error(
        "Wallet not connected. Please connect your wallet first."
      );
    }

    if (!walletAddress) {
      throw new Error("Alamat Wallet harus diisi.");
    }

    const txHash = await removeAdminOnChain(walletAddress);

    return {
      status: "SUCCESS",
      transactionHash: txHash,
    };
  } catch (error) {
    throw error;
  }
};
