"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge";
import Pagination from "./Pagination";
import { shortenHash } from "@/utils/formatters";
import { formatDate } from "@/utils/formatDate";
import { Modal } from "../ui/modal";
import { useModal } from "@/hooks/useModal";
import { getTransactions } from "@/services/transaction/getTransactions";
import Select from "../form/input/Select";
import { ChevronDownIcon, CopyIcon } from "@/icons";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ListTransactions() {
  const modal = useModal();
  const [dataModal, setDataModal] = useState([]);
  const [isHashCopied, setIsHashCopied] = useState(false);

  const [apiResponse, setApiResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    transactionType: "",
    searchQuery: "",
  });

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTransactions({
          page: currentPage,
          limit: 10,
          status: filters.status || undefined, // Send undefined if filter is empty
          transactionType: filters.transactionType || undefined,
          searchQuery: filters.searchQuery || undefined,
        });
        setApiResponse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: searchInput }));
    setCurrentPage(1);
  };

  const handlerModal = (data) => {
    setDataModal(data);
    modal.openModal();
  };

  const handleCopy = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsHashCopied(true);
      setTimeout(() => setIsHashCopied(false), 2000);
    });
  };

  const transactions = apiResponse?.transactions || [];

  const optionsStatus = [
    { value: "", label: "All Status" },
    { value: "SUCCESS", label: "Success" },
    { value: "REVOKED", label: "Revoked" },
  ];

  const optionsType = [
    { value: "", label: "All Types" },
    { value: "ISSUE", label: "Issue" },
    { value: "REVOKE", label: "Revoke" },
  ];

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
      <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="relative w-full sm:w-auto">
          <Select
            options={optionsStatus}
            onChange={(value) => handleFilterChange("status", value)}
            defaultValue={filters.status}
            placeholder="All Status"
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
        <div className="relative w-full sm:w-auto">
          <Select
            options={optionsType}
            onChange={(value) => handleFilterChange("transactionType", value)}
            defaultValue={filters.transactionType}
            placeholder="All Types"
            className="dark:bg-dark-900"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <ChevronDownIcon />
          </span>
        </div>
        <form
          onSubmit={handleSearch}
          className="w-auto ml-auto flex items-center gap-2"
        >
          <Input
            type="text"
            placeholder="Search By Txn Hash or Student Id..."
            defaultValue={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="dark:bg-dark-900"
          />
          <Button size="sm" type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>
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
                    Txn Hash
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Txn Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Date Time
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    From
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Student ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="whitespace-nowrap px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Txn Fee
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {transactions.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-blue-500 text-start text-theme-sm dark:text-blue-400">
                      <button onClick={() => handlerModal(order)}>
                        {shortenHash(order.transactionHash, 10, 4)}
                      </button>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.transactionType}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {formatDate(order.confirmedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {shortenHash(order.originWallet, 10, 4)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {order.studentId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={order.status === "SUCCESS" ? "success" : "error"}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {parseFloat(order.transactionFee).toFixed(8)} POL
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {apiResponse && apiResponse.totalPages > 1 && (
        <div className="mt-4 flex flex-col  justify-center">
          <Pagination
            currentPage={apiResponse.currentPage}
            totalPages={apiResponse.totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
          <p className="mt-2 text-gray-500 text-sm text-center">
            Total Page: {apiResponse.totalPages}
          </p>
        </div>
      )}
      <Modal isOpen={modal.isOpen} className="max-w-3xl p-5 lg:p-10">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>
          <button
            onClick={modal.closeModal}
            className="text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        {dataModal && (
          <div className="mt-5 space-y-4 text-sm">
            <div className="pb-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  Txn Hash
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-600 break-all dark:text-gray-400">
                    {dataModal.transactionHash}
                  </span>
                  <button
                    onClick={() => handleCopy(dataModal.transactionHash)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    title="Copy hash"
                  >
                    {isHashCopied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <CopyIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  Result
                </span>
                <Badge
                  size="sm"
                  color={dataModal.status === "SUCCESS" ? "success" : "error"}
                >
                  {dataModal.status}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  Block
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {dataModal.blockNumber}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  Date time
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatDate(dataModal.confirmedAt)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  From
                </span>
                <span className="font-mono text-gray-600 break-all dark:text-gray-400">
                  {dataModal.originWallet}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-300 mb-1 sm:mb-0">
                  Transaction Type
                </span>
                <span className="font-mono text-gray-600 break-all dark:text-gray-400">
                  {dataModal.transactionType}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-400">
                  Data On Chain
                </span>
                <span className="text-gray-600 break-all dark:text-gray-400">
                  {dataModal.certificateHashOnchain
                    ? dataModal.certificateHashOnchain
                    : "Null"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row">
                <span className="w-full font-medium text-gray-700 sm:w-32 dark:text-gray-400">
                  Txn fee
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {parseFloat(dataModal.transactionFee).toFixed(8)} POL
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
