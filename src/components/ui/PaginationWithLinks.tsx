"use client";

import { type ReactNode, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string;
    pageSizeOptions: number[];
  };
  totalCount: number;
  pageSize: number;
  page: number;
  pageSearchParam?: string;
}

/**
 * Navigate with Nextjs links (need to update your own `pagination.tsx` to use Nextjs Link)
 * 
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam
}: PaginationWithLinksProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPageCount = Math.ceil(totalCount / pageSize);

  const buildSearchParams = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || "page";
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set(key, String(newPage));
      return newSearchParams.toString();
    },
    [searchParams, pageSearchParam]
  );

  const navigateToPage = useCallback(
    (newPage: number) => {
      const queryString = buildSearchParams(newPage);
      window.history.pushState({}, "", `${pathname}?${queryString}`);
      // Manually trigger a router refresh since pushState doesn't
      // router.refresh();
    },
    [pathname, buildSearchParams, router]
  );

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || "pageSize";
      const newSearchParams = new URLSearchParams(searchParams || undefined);
      newSearchParams.set(key, String(newPageSize));
      newSearchParams.delete(pageSearchParam || "page"); // Clear the page number when changing page size
      // router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [searchParams, pathname]
  );

  const renderPageNumbers = () => {
    const items: ReactNode[] = [];
    const maxVisiblePages = 5;

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <Button
              variant="ghost"
              className={cn("h-9 w-9", { "bg-muted": page === i })}
              onClick={() => navigateToPage(i)}
            >
              {i}
            </Button>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <Button
            variant="ghost"
            className={cn("h-9 w-9", { "bg-muted": page === 1 })}
            onClick={() => navigateToPage(1)}
          >
            1
          </Button>
        </PaginationItem>
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <Button
              variant="ghost"
              className={cn("h-9 w-9", { "bg-muted": page === i })}
              onClick={() => navigateToPage(i)}
            >
              {i}
            </Button>
          </PaginationItem>
        );
      }

      if (page < totalPageCount - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <Button
            variant="ghost"
            className={cn("h-9 w-9", { "bg-muted": page === totalPageCount })}
            onClick={() => navigateToPage(totalPageCount)}
          >
            {totalPageCount}
          </Button>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
      {pageSizeSelectOptions && (
        <div className="flex flex-1 flex-col gap-4">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => navigateToPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className={cn("gap-1 pl-2.5", {
                "pointer-events-none opacity-50": page === 1
              })}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Poprzednia</span>
            </Button>
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => navigateToPage(Math.min(page + 1, totalPageCount))}
              disabled={page === totalPageCount}
              className={cn("gap-1 pr-2.5", {
                "pointer-events-none opacity-50": page === totalPageCount
              })}
            >
              <span>Następna</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize
}: {
  options: number[];
  setPageSize: (newSize: number) => void;
  pageSize: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Rows per page</span>

      <Select
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select page size">
            {String(pageSize)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
