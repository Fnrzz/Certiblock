"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDate } from "@/utils/formatDate";
import { getWallets } from "@/services/wallet/walletService";

export default function ListWallet() {
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWallets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getWallets();
        console.log(data);
        setWallets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWallets();
    console.log(wallets);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }
  return (
    <div className="overflow-hidden">
      <div className=" mb-4 rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="w-full">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Wallet Address
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Created At
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {wallets.map((wallet, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {wallet.walletAddress}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {wallet.created_at
                        ? formatDate(wallet.created_at)
                        : "Null"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
