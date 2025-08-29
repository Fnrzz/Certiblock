export const getWallets = async () => {
  try {
    const response = await fetch(`/api/wallets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch users.");
    }

    return data.data || [];
  } catch (error) {
    throw error;
  }
};
