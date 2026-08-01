import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { SortConfig } from "@/hooks/use-data-table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ searchTerm, setSearchTerm, placeholder = "Cari data..." }: SearchBarProps) {
  return (
    <div className="relative w-full md:w-72 mb-4">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

export function SortIndicator({ columnKey, sortConfig }: { columnKey: string; sortConfig: SortConfig }) {
  if (sortConfig?.key !== columnKey) {
    return <span className="ml-1 opacity-20"><ChevronUp className="inline h-3 w-3" /></span>;
  }
  return sortConfig.direction === "asc" ? (
    <span className="ml-1"><ChevronUp className="inline h-3 w-3" /></span>
  ) : (
    <span className="ml-1"><ChevronDown className="inline h-3 w-3" /></span>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function TablePagination({ currentPage, totalPages, setCurrentPage }: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex justify-end">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-4 py-2 text-sm">
              Halaman {currentPage} dari {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
