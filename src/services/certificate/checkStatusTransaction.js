import Cookies from "js-cookie";
export const checkStatusTransaction = async (txHash) => {
  try {
    const jwtToken = Cookies.get("token");
    if (!jwtToken) {
      throw new Error("Admin authentication token not found.");
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/status/${txHash}`,
      {
        method: "GET",
        headers: {
          "x-api-key": user.apiKey,
        },
      }
    );

    const dataFetch = await response.json();

    if (!response.ok) {
      throw new Error(
        dataFetch.details || "An error occurred from the backend."
      );
    }

    const {
      transactionHash,
      certificateHashOnchain,
      status,
      transactionFee,
      transactionType,
      confirmedAt,
      failedAt,
    } = dataFetch;

    // Jika berhasil, kembalikan data yang dibutuhkan
    return {
      status: status,
      transactionHash: transactionHash,
      certificateHashOnchain: certificateHashOnchain,
      transactionFee: transactionFee,
      transactionType: transactionType,
      confirmedAt: confirmedAt,
      failedAt: failedAt,
    };
  } catch (error) {
    throw error;
  }
};
