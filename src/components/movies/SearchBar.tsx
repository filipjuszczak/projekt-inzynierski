"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("title") || "");

  useDebounce(
    () => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("title", searchTerm);
      } else {
        params.delete("title");
      }
      router.push(`?${params.toString()}`);
    },
    500,
    [searchTerm, searchParams, router]
  );

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder="Szukaj filmów..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
