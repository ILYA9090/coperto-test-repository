import { queryOptions } from "@tanstack/react-query";
import type { MenuItem } from "@/types/menu";

export const menuKeys = {
  list: ["menu-items"] as const,
};

async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu-items");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Не удалось загрузить меню");
  }
  return res.json();
}

export const menuItemsQueryOptions = queryOptions({
  queryKey: menuKeys.list,
  queryFn: fetchMenuItems,
});
