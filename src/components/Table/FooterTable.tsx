import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface Props {
  count: number;
  lenght?: number;
  onPress: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  page: number;
  showPagination?: boolean;
}

export default function FooterTable({
  count,
  page,
  showPagination = true,
  lenght = 10,
  onPress,
  onPrev,
  onNext,
}: Props) {
  const pages = Math.ceil(count / lenght);

  return (
    <div className="w-full flex items-center justify-between border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
      {/* <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={onPrev}
        >
          Previos
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={onNext}
       >
          Próximos
        </a>
      </div> */}
      {showPagination && (
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span className="font-medium">{(page - 1) * 10 + 1}</span> a{" "}
              <span className="font-medium">{Math.min(page * 10, count)}</span> de{" "}
              <span className="font-medium">{count}</span> resultados
            </p>
          </div>

          <div>
            <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <a
                href="#"
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                onClick={onPrev}
              >
                <span className="sr-only">Previos</span>
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
              </a>
              {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
              {Array(Math.min(pages, pages > 6 ? 3 : 6))
                .fill(null)
                .map((item, index) => (
                  <a
                    href="#"
                    aria-current="page"
                    key={`${index + 1}`}
                    className={clsx(
                      page === index + 1 ? "bg-blue-600 hover:bg-blue-500" : "",
                      "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    )}
                    onClick={() => {
                      onPress(index + 1);
                    }}
                  >
                    {index + 1}
                  </a>
                ))}

              {pages > 6 ? (
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0">
                  ...
                </span>
              ) : null}

              {Array(pages > 6 ? 3 : 0)
                .fill(null)
                .map((item, index) => (
                  <a
                    href="#"
                    key={`${index + 1}`}
                    className={clsx(
                      page === index + pages - 2 ? "bg-blue-600 hover:bg-blue-500" : "",
                      "relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 md:inline-flex"
                    )}
                    onClick={() => {
                      onPress(index + pages - 2);
                    }}
                  >
                    {index + pages - 2}
                  </a>
                ))}
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0"
                onClick={onNext}
              >
                <span className="sr-only">Próximo</span>
                <ChevronRightIcon aria-hidden="true" className="size-5" />
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
