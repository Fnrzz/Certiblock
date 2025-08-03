import Cookies from "js-cookie";

export const getTransactions = async (options = {}) => {
  try {
    const { page = 1, limit, status, transactionType, searchQuery } = options;

    const params = new URLSearchParams({
      page: page,
      limit: limit,
    });
    if (status) params.append("status", status);
    if (searchQuery) params.append("searchQuery", searchQuery);
    if (transactionType) params.append("transactionType", transactionType);

    const jwtToken = Cookies.get("token");
    if (!jwtToken) {
      throw new Error("Admin authentication token not found.");
    }

    const response = await fetch(`/api/transactions?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions.");
    }

    return data || [];
  } catch (error) {
    throw error;
  }
};
