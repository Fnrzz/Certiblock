import { supabase } from "@/utils/supabase/supabaseClient";

export const uploadCertificateFile = async (jsonData, fileName) => {
  // 1. Ubah objek JSON menjadi file Blob
  const jsonString = JSON.stringify(jsonData, null, 2);
  const file = new Blob([jsonString], { type: "application/json" });

  // 2. Tentukan path unik di dalam bucket storage
  const filePath = `private/${fileName}`;

  // 3. Unggah file ke Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("certificates") // Nama bucket Anda
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // Timpa file jika sudah ada dengan nama yang sama
    });

  if (uploadError) {
    throw new Error(`Failed to upload file to storage: ${uploadError.message}`);
  }

  // 4. Simpan path file ke tabel database
  const { error: dbError } = await supabase.from("certificate_files").upsert(
    {
      student_id_number: jsonData.studentDetails.studentIdNumber, // Kunci unik
      file_path: uploadData.path,
    },
    { onConflict: "student_id_number" }
  ); // Jika NIM sudah ada, update record-nya

  if (dbError) {
    // Jika gagal menyimpan ke DB, hapus file yang sudah terunggah untuk konsistensi
    await supabase.storage.from("certificates").remove([filePath]);
    throw new Error(`Failed to save file path to database: ${dbError.message}`);
  }

  return uploadData.path;
};
