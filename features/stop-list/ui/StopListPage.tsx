// features/stop-list/ui/StopListPage.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { menuItemsQueryOptions } from "../model/queries";
import { filterMenuItems } from "../model/filters";
import type { MenuFilters } from "../model/filters";
import type { MenuItem } from "@/types/menu";
import { Filters } from "./Filters";
import { StopListTable } from "./StopListTable";

export function StopListPage({ filters }: { filters: MenuFilters }) {
  const { data, isPending, isError, error } = useQuery(menuItemsQueryOptions);

  function handleStopClick(item: MenuItem) {
    console.log("open stop panel for", item.id);
  }

  function handleResumeClick(item: MenuItem) {
    console.log("resume", item.id);
  }

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
        <h1 className="text-2xl font-semibold">Стоп-лист кухни</h1>
        <Filters filters={filters} />
        <p className="text-foreground/60">Загрузка…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
        <h1 className="text-2xl font-semibold">Стоп-лист кухни</h1>
        <Filters filters={filters} />
        <p className="text-accent">
          Не удалось загрузить меню: {error.message}
        </p>
      </div>
    );
  }

  const filteredItems = filterMenuItems(data, filters);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Стоп-лист кухни</h1>
      <Filters filters={filters} />

      {filteredItems.length === 0 ? (
        <p className="text-foreground/60">
          Ничего не найдено по выбранным фильтрам.
        </p>
      ) : (
        <StopListTable
          items={filteredItems}
          onStopClick={handleStopClick}
          onResumeClick={handleResumeClick}
          pendingIds={new Set()}
        />
      )}
    </div>
  );
}
