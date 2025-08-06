import { simulateContract, writeContract } from "wagmi/actions";
import { config } from "@/providers/WagmiProvider";
import { contractABI } from "./contractAbi";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const addAdminOnChain = async (walletAddress) => {
  try {
    const { request } = await simulateContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "addAdmin",
      args: [walletAddress],
    });
    const hash = await writeContract(config, request);
    return hash;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const removeAdminOnChain = async (walletAddress) => {
  try {
    const { request } = await simulateContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "removeAdmin",
      args: [walletAddress],
    });
    const hash = await writeContract(config, request);
    return hash;
  } catch (error) {
    throw error;
  }
};

export const issueCertificateOnChain = async (nim, certificateHash) => {
  try {
    const { request } = await simulateContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "issueCertificate",
      args: [nim, certificateHash],
    });
    const hash = await writeContract(config, request);
    return hash;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

export const revokeCertificateOnChain = async (nim) => {
  try {
    const { request } = await simulateContract(config, {
      address: contractAddress,
      abi: contractABI,
      functionName: "revokeCertificate",
      args: [nim],
    });

    const hash = await writeContract(config, request);
    return hash;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

function getFriendlyErrorMessage(error) {
  if (error.name === "UserRejectedRequestError") {
    return "Transaction was rejected by the user in their wallet.";
  }

  // Pesan error dari simulasi sekarang akan jauh lebih informatif
  if (error.shortMessage) {
    if (error.shortMessage.includes("UnauthorizedWallet")) {
      return "This action can only be performed by the contract's Super Admin and Admin addresses.";
    }
    if (error.shortMessage.includes("is missing role")) {
      return "This action can only be performed by an authorized Admin address.";
    }
    if (
      error.shortMessage.includes(
        "An active certificate for this NIM already exists"
      )
    ) {
      return "This Student ID already has an active certificate.";
    }
    if (
      error.shortMessage.includes("Certificate for this NIM does not exist")
    ) {
      return "Cannot revoke: A certificate for this Student ID does not exist.";
    }
    if (error.shortMessage.includes("insufficient funds")) {
      return "Insufficient funds for gas fee.";
    }
    const reasonMatch = error.shortMessage.match(/Reason: (.*)/);
    if (reasonMatch && reasonMatch[1]) {
      return reasonMatch[1];
    }
  }

  return "An unknown error occurred during the blockchain transaction.";
}
