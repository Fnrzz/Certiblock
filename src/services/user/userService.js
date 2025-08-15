import { config } from "@/providers/WagmiProvider";
import { getAccount } from "wagmi/actions";
import { addAdminOnChain, removeAdminOnChain } from "../blockchain/contract";

export const getUsers = async () => {
  try {
    const response = await fetch(`/api/users/list-admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch users.");
    }

    return data.users || [];
  } catch (error) {
    throw error;
  }
};

export const addUsers = async (request) => {
  try {
    const response = await fetch("/api/users/create-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: request.email,
        password: request.password,
        displayName: request.displayName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add user.");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

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
