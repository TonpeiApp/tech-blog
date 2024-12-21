import Link from 'next/link';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <nav className="m-10 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      {/* Previous Button */}
      <div className="-mt-px flex w-0 flex-1">
        {currentPage > 1 && (
          <Link
            href={`/${currentPage - 1}`}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon aria-hidden="true" className="mr-3 text-gray-400" />
            Previous
          </Link>
        )}
      </div>

      {/* Page Numbers */}
      <div className="hidden md:flex">
        {Array.from({ length: totalPages }, (_, index) => (
          <Link
            key={index + 1}
            href={`/page/${index + 1}`}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
              currentPage === index + 1
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {index + 1}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      <div className="-mt-px flex w-0 flex-1 justify-end">
        {currentPage < totalPages && (
          <Link
            href={`/${currentPage + 1}`}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon aria-hidden="true" className="ml-3 text-gray-400" />
          </Link>
        )}
      </div>
    </nav>
  );
}
