import React from 'react';

interface PaginationProps {
  page: number;
  totalItems: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalItems,
  limit,
  setPage,
  setLimit,
}) => {
  const totalPages = Math.ceil(totalItems / limit);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 gap-4 mb-1">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="font-medium text-sm">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Numbered Pagination */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-3 py-1 text-sm border rounded ${
              p === page ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};
