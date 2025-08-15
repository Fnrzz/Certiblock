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
    throw new Error(getRevertReason(error));
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
    throw new Error(getRevertReason(error));
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
    throw new Error(getRevertReason(error));
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
    throw new Error(getRevertReason(error));
  }
};

const getRevertReason = (error) => {
  if (error.name === "UserRejectedRequestError") {
    return "Transaction was rejected by the user.";
  }

  if (error.cause && error.cause.reason) {
    return error.cause.reason;
  }

  if (error.shortMessage) {
    const match = error.shortMessage.match(/Reason: (.*)/);
    if (match && match[1]) {
      return match[1];
    }
    return error.shortMessage;
  }

  return "An unknown blockchain error occurred.";
};
