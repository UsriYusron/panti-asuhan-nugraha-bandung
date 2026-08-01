import { useState, useMemo } from "react";

export type SortConfig = {
  key: string;
  direction: "asc" | "desc";
} | null;

export function useDataTable<T>(data: T[], searchKeys: (keyof T)[], itemsPerPage: number = 10) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Search (Filter)
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedSearch = searchTerm.toLowerCase();
    
    return data.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowercasedSearch);
        }
        return false;
      });
    });
  }, [data, searchTerm, searchKeys]);

  // 2. Sort
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // 3. Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  // Ensure currentPage is valid if data shrinks due to search/delete
  const validCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  if (validCurrentPage !== currentPage) {
    setCurrentPage(validCurrentPage);
  }

  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, validCurrentPage, itemsPerPage]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return {
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    currentPage: validCurrentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    totalItems: sortedData.length,
  };
}
