import type { MenuItem, Shop } from "@/types/menu";

export type StatusFilter = "available" | "stopped";

export interface MenuFilters {
  shop: Shop | null;
  status: StatusFilter | null;
}

const VALID_SHOPS = ["kitchen", "bar", "pastry"] as const;
const VALID_STATUSES = ["available", "stopped"] as const;

export function isShop(value: unknown): value is Shop {
  return (
    typeof value === "string" &&
    (VALID_SHOPS as readonly string[]).includes(value)
  );
}

export function isStatusFilter(value: unknown): value is StatusFilter {
  return (
    typeof value === "string" &&
    (VALID_STATUSES as readonly string[]).includes(value)
  );
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): MenuFilters {
  const shopRaw = searchParams.shop;
  const statusRaw = searchParams.status;

  return {
    shop: isShop(shopRaw) ? shopRaw : null,
    status: isStatusFilter(statusRaw) ? statusRaw : null,
  };
}

export function filtersToSearchParams(filters: MenuFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.shop !== null) params.set("shop", filters.shop);
  if (filters.status !== null) params.set("status", filters.status);
  params.sort();
  return params;
}

export function filterMenuItems(
  items: MenuItem[],
  filters: MenuFilters,
): MenuItem[] {
  return items.filter((item) => {
    if (filters.shop !== null && item.shop !== filters.shop) return false;
    if (filters.status !== null && item.status.kind !== filters.status)
      return false;
    return true;
  });
}
