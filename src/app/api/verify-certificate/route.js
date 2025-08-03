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
      throw new Error("File sertifikat tidak valid: NIM tidak ditemukan.");
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
        message: "Sertifikat Terverifikasi!",
        source: "Blockchain",
      });
    } else {
      return NextResponse.json(
        {
          isValid: false,
          details:
            "Verifikasi Gagal: Konten file tidak cocok atau sertifikat telah dicabut.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Verify Error:", error);
    return NextResponse.json(
      { details: "Terjadi kesalahan internal saat verifikasi." },
      { status: 500 }
    );
  }
}
