import { getAccount } from "wagmi/actions";
import { revokeCertificateOnChain } from "../blockchain/contract";
import { config } from "@/providers/WagmiProvider";

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

const verifyData = async (file) => {
  const formData = new FormData();
  formData.append("certificateFile", file);
  const response = await fetch(`/api/verify-certificate`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      "Certificate data is not valid or not found on the blockchain."
    );
  }
  return result;
};

export const revokeCertificate = async (file) => {
  try {
    const account = getAccount(config);
    if (!account.isConnected) {
      throw new Error(
        "Wallet not connected. Please connect your wallet first."
      );
    }
    await verifyData(file);
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
