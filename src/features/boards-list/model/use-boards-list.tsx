import { rqClient } from "@/shared/api/instance";
import { keepPreviousData } from "@tanstack/query-core";
import { RefCallback, useCallback } from "react";

const INTERSECTION_THRESHOLD = 0.5;
const DEFAULT_BOARDS_LIMIT = 20;

type UseBoardsListParams = {
  limit?: number;
  isFavorite?: boolean;
  search?: string;
  sort?: "createdAt" | "updatedAt" | "lastOpenedAt" | "name";
};

export function useBoardsList({
  limit = DEFAULT_BOARDS_LIMIT,
  isFavorite,
  search,
  sort,
}: UseBoardsListParams) {
  const { fetchNextPage, data, isFetchingNextPage, isPending, hasNextPage } =
    rqClient.useInfiniteQuery(
      "get",
      "/boards",
      {
        params: {
          query: {
            page: 1,
            limit,
            isFavorite,
            search,
            sort,
          },
        },
      },
      {
        initialPageParam: 1,
        pageParamName: "page",
        getNextPageParam: (lastPage, _, lastPageParams) =>
          Number(lastPageParams) < lastPage.totalPages
            ? Number(lastPageParams) + 1
            : null,

        placeholderData: keepPreviousData,
      },
    );

  const cursorRef: RefCallback<HTMLDivElement> = useCallback(
    (el) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: INTERSECTION_THRESHOLD },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    },
    [fetchNextPage, hasNextPage],
  );

  const boards = data?.pages.flatMap((page) => page.list) ?? [];

  return {
    boards,
    isFetchingNextPage,
    isPending,
    hasNextPage,
    cursorRef,
  };
}
