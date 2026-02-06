import Link from 'next/link';

export function Pagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {currentPage <= 1 ? (
        <span className="px-4 py-2 bg-gray-700 text-white rounded-md opacity-50 cursor-not-allowed">
          前へ
        </span>
      ) : (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          前へ
        </Link>
      )}
      <span className="text-gray-300">
        {currentPage} / {totalPages}
      </span>
      {currentPage >= totalPages ? (
        <span className="px-4 py-2 bg-gray-700 text-white rounded-md opacity-50 cursor-not-allowed">
          次へ
        </span>
      ) : (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          次へ
        </Link>
      )}
    </div>
  );
}
