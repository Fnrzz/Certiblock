export const getPendingUsers = async (apiKey) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/pending`,
      {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Lemparkan error dengan pesan dari API jika ada, atau pesan default
      throw new Error(data.message || "Gagal mengambil data pengguna pending.");
    }

    return data.users || [];
  } catch (error) {
    console.error("Error di service getPendingUsers:", error);
    // Lemparkan kembali error agar bisa ditangani oleh komponen
    throw error;
  }
};
