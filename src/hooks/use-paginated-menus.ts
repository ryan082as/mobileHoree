import { useCallback, useEffect, useRef, useState } from "react";
import { getMenusByGeraiId } from "@/services/umkmService";
import { MenuPopulerItem } from "@/types/umkm";

/**
 * Manages server-side paginated and searchable store menus so catalogs with 10,000+ rows
 * render quickly without hitting PostgREST row caps or blocking the UI thread.
 */
export function usePaginatedMenus(geraiId: string | undefined, pageSize = 25) {
  const [items, setItems] = useState<MenuPopulerItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const seqRef = useRef<number>(0);

  const fetchPage = useCallback(
    async (targetPage: number, query: string) => {
      if (!geraiId) return;
      const reqId = ++seqRef.current;
      setLoading(true);
      try {
        const res = await getMenusByGeraiId(geraiId, {
          page: targetPage,
          pageSize,
          search: query,
        });
        if (reqId !== seqRef.current) return;
        if (targetPage > 0 && res.items.length === 0 && res.totalCount > 0) {
          const fallbackPage = Math.max(0, res.totalPages - 1);
          const fallbackRes = await getMenusByGeraiId(geraiId, {
            page: fallbackPage,
            pageSize,
            search: query,
          });
          if (reqId !== seqRef.current) return;
          setItems(fallbackRes.items);
          setTotalCount(fallbackRes.totalCount);
          setTotalPages(fallbackRes.totalPages);
          setPage(fallbackRes.page);
          return;
        }
        setItems(res.items);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
        setPage(res.page);
      } catch (err) {
        if (reqId === seqRef.current) {
          console.error("Gagal memuat halaman menu:", err);
        }
      } finally {
        if (reqId === seqRef.current) {
          setLoading(false);
        }
      }
    },
    [geraiId, pageSize]
  );

  useEffect(() => {
    if (!geraiId) return;
    const timer = setTimeout(() => {
      fetchPage(0, searchQuery);
    }, searchQuery ? 250 : 0);
    return () => clearTimeout(timer);
  }, [geraiId, searchQuery, fetchPage]);

  const goToPage = useCallback(
    (nextPage: number) => {
      fetchPage(nextPage, searchQuery);
    },
    [fetchPage, searchQuery]
  );

  const refresh = useCallback(
    (resetToFirstPage = false) => {
      fetchPage(resetToFirstPage ? 0 : page, searchQuery);
    },
    [fetchPage, page, searchQuery]
  );

  return {
    items,
    totalCount,
    totalPages,
    page,
    pageSize,
    searchQuery,
    loading,
    setSearchQuery,
    goToPage,
    refresh,
  };
}
