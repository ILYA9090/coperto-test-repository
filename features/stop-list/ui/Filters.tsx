// features/stop-list/ui/Filters.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { Select } from "@/shared/ui/Select";
import {
  filtersToSearchParams,
  isShop,
  isStatusFilter,
} from "../model/filters";
import type { MenuFilters } from "../model/filters";

const SHOP_OPTIONS = [
  { value: "", label: "Все цеха" },
  { value: "kitchen", label: "Кухня" },
  { value: "bar", label: "Бар" },
  { value: "pastry", label: "Кондитерская" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "available", label: "В продаже" },
  { value: "stopped", label: "В стоп-листе" },
];

export function Filters({ filters }: { filters: MenuFilters }) {
  const router = useRouter();
  const pathname = usePathname();

  function updateFilters(next: MenuFilters) {
    const params = filtersToSearchParams(next);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex gap-4">
      <Select
        label="Цех"
        value={filters.shop ?? ""}
        options={SHOP_OPTIONS}
        onChange={(e) => {
          const value = e.target.value;
          updateFilters({
            ...filters,
            shop: value === "" ? null : isShop(value) ? value : null,
          });
        }}
      />
      <Select
        label="Статус"
        value={filters.status ?? ""}
        options={STATUS_OPTIONS}
        onChange={(e) => {
          const value = e.target.value;
          updateFilters({
            ...filters,
            status: value === "" ? null : isStatusFilter(value) ? value : null,
          });
        }}
      />
    </div>
  );
}
