export const verifyCertificateFile = async (file) => {
  const formData = new FormData();
  formData.append("certificateFile", file);

  try {
    const response = await fetch(`/api/verify-certificate`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.details || "Gagal memverifikasi sertifikat.");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
