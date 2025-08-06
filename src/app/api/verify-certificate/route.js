import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { polygonAmoy } from "viem/chains";
import { contractABI } from "@/services/blockchain/contractAbi";
import { createCertificateHash } from "@/services/certificate/createCertificateHash";

const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const certificateFile = formData.get("certificateFile");

    if (!certificateFile) {
      return NextResponse.json(
        { details: "Tidak ada file yang diunggah." },
        { status: 400 }
      );
    }

    const fileContentText = await certificateFile.text();
    const certificateFileContent = JSON.parse(fileContentText);

    const nim = certificateFileContent?.studentDetails?.studentIdNumber;
    if (!nim) {
      throw new Error("Invalid certificate file: NIM not found.");
    }

    const hashToVerify = await createCertificateHash(certificateFileContent);

    const isValidOnChain = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: "verifyCertificate",
      args: [nim, hashToVerify],
    });

    if (isValidOnChain) {
      return NextResponse.json({
        isValid: true,
        data: certificateFileContent,
        dataOnChain: hashToVerify,
        message: "Verified Certificate!",
        source: "Blockchain",
      });
    } else {
      return NextResponse.json(
        {
          isValid: false,
          details:
            "File contents do not match or certificate has been revoked.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Verify Error:", error);
    return NextResponse.json(
      { details: "An internal error occurred during verification." },
      { status: 500 }
    );
  }
}
