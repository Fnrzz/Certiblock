import { getAccount } from "wagmi/actions";
import { revokeCertificateOnChain } from "../blockchain/contract";
import { config } from "@/providers/WagmiProvider";
import Cookies from "js-cookie";

const getNimFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const nim = json.studentDetails.studentIdNumber;
        if (!nim) reject(new Error("NIM not found in JSON file."));
        resolve(nim);
      } catch (e) {
        reject(new Error("Invalid JSON file."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const revokeCertificate = async (file) => {
  try {
    const jwtToken = Cookies.get("token");

    if (!jwtToken) {
      throw new Error("Admin authentication token not found.");
    }

    const account = getAccount(config);
    if (!account.isConnected) {
      throw new Error(
        "Wallet not connected. Please connect your wallet first."
      );
    }
    const nimToRevoke = await getNimFromFile(file);

    const txHash = await revokeCertificateOnChain(nimToRevoke);

    return {
      status: "SUCCESS",
      revokeTransactionHash: txHash,
    };
  } catch (err) {
    throw err;
  }
};
