"use client";

import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Create page array with truncation
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => {
      if (page === 1 || page === totalPages) return true;
      if (Math.abs(page - currentPage) <= 1) return true;
      return false;
    }
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-purple-500 hover:text-white disabled:opacity-50 transition-colors"
      >
        ◀
      </button>

      {/* Page numbers with truncation */}
      {pages.map((page, idx, arr) => {
        const prev = arr[idx - 1];
        return (
          <span key={page}>
            {prev && page - prev > 1 && <span className="px-2">…</span>}
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-full transition-colors ${
                page === currentPage
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          </span>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-purple-500 hover:text-white disabled:opacity-50 transition-colors"
      >
        ▶
      </button>
    </div>
  );
}
