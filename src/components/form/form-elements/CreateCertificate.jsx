"use client";
import React, { useState } from "react";
import Label from "../Label";
import Input from "../input/InputField";
import DatePicker from "../input/DatePicker";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import TextArea from "../input/TextArea";
import { CheckCircleIcon, CopyIcon, DownloadIcon } from "@/icons";
import { issueCertificate } from "@/services/certificate/issueCertificate";
import { downloadCertificateByNIM } from "@/services/certificate/downloadCertificate";
import { uploadCertificateFile } from "@/services/certificate/uploadCertificate";

export default function CreateCertificate() {
  const successModal = useModal();
  const errorModal = useModal();
  const confirmationModal = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [isHashCopied, setIsHashCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mengambil semua data dari form
      const formData = new FormData(e.target);
      const studentData = Object.fromEntries(formData.entries());

      // Panggil service
      const result = await issueCertificate(studentData);
      setSubmissionResult(result);

      const studentID = result.certificateData.studentDetails.studentIdNumber;
      const fileName = `certificate-${studentID}.json`;

      await uploadCertificateFile(result.certificateData, fileName);

      successModal.openModal();
      e.target.reset();
    } catch (err) {
      // Simpan pesan error dan buka modal error
      setError(err.message);
      errorModal.openModal();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseErrorModal = () => {
    errorModal.closeModal();
  };

  const handleCopy = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsHashCopied(true);
        setTimeout(() => setIsHashCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin:", err);
      });
  };

  const handleDownloadJson = async (studentIdNumber) => {
    if (!studentIdNumber) return;
    await downloadCertificateByNIM(studentIdNumber);
  };

  const handleConfirmAndCloseAll = () => {
    confirmationModal.closeModal();
    if (submissionResult.status === "PENDING") {
      warningModal.closeModal();
    } else {
      successModal.closeModal();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label>Full Name</Label>
            <Input type="text" placeholder="John Doe" name="fullName" />
          </div>
          <div>
            <Label>Student ID Number</Label>
            <Input
              type="text"
              placeholder="A123456789"
              name="studentIdNumber"
            />
          </div>
          <div>
            <Label>GPA (Grade Point Average)</Label>
            <Input
              type="number"
              placeholder="4.0"
              name="gpa"
              step="0.01"
              min="0"
              max="4"
            />
          </div>
          <div>
            <DatePicker
              id="date-picker"
              label="Graduation Date"
              placeholder="Select a date"
              onChange={(dates, currentDateString) => {
                console.log({ dates, currentDateString });
              }}
              name="graduationDate"
              mode="single"
            />
          </div>
          <div>
            <Label>Diploma Serial Number</Label>
            <Input
              type="text"
              placeholder="UTD-TI-2025-00201"
              name="diplomaSerialNumber"
            />
          </div>
          <div>
            <Label>National Diploma Number PIN</Label>
            <Input
              type="text"
              placeholder="202511223344556677889"
              name="nationalDiplomaNumberPin"
            />
          </div>
          <div>
            <Label>Transcript Serial Number</Label>
            <Input
              type="text"
              placeholder="UTD-TR-2025-00201"
              name="transcriptSerialNumber"
            />
          </div>
          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
      </form>

      <Modal isOpen={successModal.isOpen} className="max-w-[600px] p-5 lg:p-10">
        <div className="relative flex items-center justify-center z-1 mb-7">
          <svg
            className="fill-success-50 dark:fill-success-500/15"
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
              fill=""
              fillOpacity=""
            />
          </svg>

          <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <svg
              className="fill-success-600 dark:fill-success-500"
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z"
                fill=""
              />
            </svg>
          </span>
        </div>
        <h4 className="mb-3 text-2xl font-semibold text-center text-gray-800 dark:text-white/90 sm:text-title-sm">
          Well Done!
        </h4>
        {/* Transaction Hash dengan Tombol Copy */}
        <div className="flex items-center justify-between">
          <h6 className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Transaction Hash :
          </h6>
          <button
            onClick={() => handleCopy(submissionResult.transactionHash)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isHashCopied ? (
              <CheckCircleIcon className="text-green-500" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="mb-3 text-sm text-gray-400 break-all text-left">
          {submissionResult?.transactionHash}
        </p>

        {/* Output JSON dengan Tombol Copy */}
        <div className="flex items-center justify-between">
          <h6 className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            Output JSON :
          </h6>
          <button
            onClick={() =>
              handleDownloadJson(
                submissionResult.certificateData.studentDetails.studentIdNumber
              )
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
        <TextArea
          value={
            submissionResult
              ? JSON.stringify(submissionResult.certificateData, null, 2)
              : ""
          }
          disabled={true}
          rows={9}
        />

        <div className="flex items-center justify-center w-full gap-3 mt-7">
          <button
            type="button"
            onClick={confirmationModal.openModal}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-gray-800 shadow-theme-xs hover:bg-gray-700 sm:w-auto"
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={confirmationModal.isOpen}
        onClose={confirmationModal.closeModal}
        className="max-w-md p-5 text-center"
      >
        <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
          Confirmation
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you have copied the Transaction Hash and Output JSON to a
          safe place?
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={confirmationModal.closeModal}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmAndCloseAll}
            className="px-6 py-2 text-sm font-medium text-white rounded-lg bg-success-500 hover:bg-success-600"
          >
            Got It
          </button>
        </div>
      </Modal>
      <Modal isOpen={errorModal.isOpen} className="max-w-[600px] p-5 lg:p-10">
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-7">
            <svg
              className="fill-error-50 dark:fill-error-500/15"
              width="90"
              height="90"
              viewBox="0 0 90 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z"
                fill=""
                fillOpacity=""
              />
            </svg>

            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <svg
                className="fill-error-600 dark:fill-error-500"
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                  fill=""
                />
              </svg>
            </span>
          </div>

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Cannot Submit!
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button
              onClick={handleCloseErrorModal}
              type="button"
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
