import Cookies from "js-cookie";
import { issueCertificateOnChain } from "../blockchain/contract"; // Panggil service blockchain
import { getAccount } from "wagmi/actions";
import { config } from "@/providers/WagmiProvider";
import { certificateTemplate } from "./certificateTemplate";
import { createCertificateHash } from "./createCertificateHash";

const getGraduationPredicate = (gpa) => {
  if (gpa >= 3.51) return "Dengan Pujian (Cum Laude)";
  if (gpa >= 3.01) return "Sangat Memuaskan";
  if (gpa >= 2.76) return "Memuaskan";
  return "Cukup";
};

export const issueCertificate = async (studentData) => {
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

    const requiredFields = [
      "fullName",
      "studentIdNumber",
      "gpa",
      "graduationDate",
      "diplomaSerialNumber",
      "nationalDiplomaNumberPin",
      "transcriptSerialNumber",
    ];

    for (const field of requiredFields) {
      if (!studentData[field] || studentData[field].trim() === "") {
        throw new Error(`Data tidak boleh kosong: ${field} harus diisi.`);
      }
    }

    const fullCertificateData = JSON.parse(JSON.stringify(certificateTemplate));
    const gpaFloat = parseFloat(studentData.gpa);

    fullCertificateData.studentDetails.fullName = studentData.fullName;
    fullCertificateData.studentDetails.studentIdNumber =
      studentData.studentIdNumber;
    fullCertificateData.academicDetails.gpa = gpaFloat;
    fullCertificateData.academicDetails.graduationDate =
      studentData.graduationDate;
    fullCertificateData.academicDetails.graduationPredicate =
      getGraduationPredicate(gpaFloat);
    fullCertificateData.validationDetails.diplomaSerialNumber =
      studentData.diplomaSerialNumber;
    fullCertificateData.validationDetails.nationalDiplomaNumberPin =
      studentData.nationalDiplomaNumberPin;
    fullCertificateData.validationDetails.transcriptSerialNumber =
      studentData.transcriptSerialNumber;
    fullCertificateData.validationDetails.issueDate = new Date()
      .toISOString()
      .split("T")[0];

    const certificateHash = await createCertificateHash(fullCertificateData);

    const txHash = await issueCertificateOnChain(
      studentData.studentIdNumber,
      certificateHash
    );

    return {
      status: "SUCCESS",
      transactionHash: txHash,
      certificateData: fullCertificateData,
    };
  } catch (error) {
    throw error;
  }
};
