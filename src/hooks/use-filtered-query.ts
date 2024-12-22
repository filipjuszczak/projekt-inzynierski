import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

interface UseFilteredQueryOptions<T> {
  endpoint: string;
  initialData?: T;
  staleTime?: number;
}

export function useFilteredQuery<T>({
  endpoint,
  initialData,
  staleTime
}: UseFilteredQueryOptions<T>) {
  const searchParams = useSearchParams();
  const [shouldFetch, setShouldFetch] = useState(false);

  const [initialQueryKey] = useState(() => [
    endpoint,
    {
      filters: Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(value);
          acc[key].sort();
          return acc;
        },
        {} as Record<string, string[]>
      )
    }
  ]);

  useEffect(() => {
    setShouldFetch(true);
  }, []);

  const currentQueryKey = [
    endpoint,
    {
      filters: Array.from(searchParams.entries()).reduce(
        (acc, [key, value]) => {
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(value);
          acc[key].sort();
          return acc;
        },
        {} as Record<string, string[]>
      )
    }
  ];

  return useQuery({
    queryKey: currentQueryKey,
    queryFn: () => {
      const params = new URLSearchParams(window.location.search);
      return ky.get(`${endpoint}?${params.toString()}`).json<T>();
    },
    initialData: () => {
      return JSON.stringify(currentQueryKey) === JSON.stringify(initialQueryKey)
        ? initialData
        : undefined;
    },
    enabled: shouldFetch,
    staleTime
  });
}
