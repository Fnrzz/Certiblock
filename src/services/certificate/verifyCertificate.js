import { readContract } from "wagmi/actions";
import { config } from "@/providers/WagmiProvider";
import { contractABI } from "@/services/blockchain/contractAbi";
import { createCertificateHash } from "./createCertificateHash";

export const verifyCertificateFile = async (file) => {
  try {
    const fileContentText = await file.text();
    const certificateFileContent = JSON.parse(fileContentText);

    const nim = certificateFileContent?.studentDetails?.studentIdNumber;
    if (!nim) {
      throw new Error("File sertifikat tidak valid: NIM tidak ditemukan.");
    }
    const hashToVerify = await createCertificateHash(certificateFileContent);

    const isValidOnChain = await readContract(config, {
      abi: contractABI,
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      functionName: "verifyCertificate",
      args: [nim, hashToVerify],
    });

    if (isValidOnChain) {
      return {
        isValid: true,
        data: certificateFileContent,
        dataOnChain: hashToVerify,
        source: "Blockchain",
      };
    } else {
      return {
        isValid: false,
        data: certificateFileContent,
        source: "Blockchain",
      };
    }
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat verifikasi.");
  }
};
