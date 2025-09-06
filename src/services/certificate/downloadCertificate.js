import { supabase } from "@/utils/supabase/supabaseClient";

export const downloadCertificateByNIM = async (nim) => {
  try {
    // 1. Cari path file di database berdasarkan NIM
    const { data: fileRecord, error: dbError } = await supabase
      .from("certificate_files")
      .select("file_path")
      .eq("student_id_number", nim)
      .single();

    if (dbError || !fileRecord) {
      throw new Error("Certificate file not found for this Student ID.");
    }

    // 2. Unduh file dari Supabase Storage menggunakan path yang ditemukan
    const { data: blob, error: downloadError } = await supabase.storage
      .from("certificates")
      .download(fileRecord.file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // 3. Memicu proses download di browser
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `certificate-${nim}.json`; // Buat nama file dinamis
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert(error.message); // Beri feedback ke pengguna
  }
};
