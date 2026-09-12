"use client";

import { useQuery, useMutationState } from "@tanstack/react-query";
import { menuItemsQueryOptions } from "../model/queries";
import { filterMenuItems } from "../model/filters";
import { useResumeItem } from "../model/use-stop-item";
import { useStopPanelStore } from "../model/stop-panel-store";
import type { MenuFilters } from "../model/filters";
import type { MenuItem } from "@/types/menu";
import { Filters } from "./Filters";
import { StopListTable } from "./StopListTable";

function PageShell({
  filters,
  children,
}: {
  filters: MenuFilters;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Стоп-лист кухни</h1>
      <Filters filters={filters} />
      {children}
    </div>
  );
}

export function StopListPage({ filters }: { filters: MenuFilters }) {
  const { data, isPending, isError, error } = useQuery(menuItemsQueryOptions);
  const resumeMutation = useResumeItem();
  const openPanel = useStopPanelStore((s) => s.open);

  const stopPendingIds = useMutationState({
    filters: { mutationKey: ["stop-item"], status: "pending" },
    select: (mutation) => (mutation.state.variables as { id: string }).id,
  });

  const resumePendingIds = useMutationState({
    filters: { mutationKey: ["resume-item"], status: "pending" },
    select: (mutation) => mutation.state.variables as string,
  });

  const pendingIds = new Set([...stopPendingIds, ...resumePendingIds]);

  function handleStopClick(item: MenuItem) {
    openPanel(item.id);
  }

  function handleResumeClick(item: MenuItem) {
    resumeMutation.mutate(item.id);
  }

  if (isPending) {
    return (
      <PageShell filters={filters}>
        <p className="text-foreground/60">Загрузка…</p>
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell filters={filters}>
        <p className="text-accent">{error.message}</p>
      </PageShell>
    );
  }

  const filteredItems = filterMenuItems(data, filters);

  return (
    <PageShell filters={filters}>
      {filteredItems.length === 0 ? (
        <p className="text-foreground/60">
          Ничего не найдено по выбранным фильтрам.
        </p>
      ) : (
        <StopListTable
          items={filteredItems}
          onStopClick={handleStopClick}
          onResumeClick={handleResumeClick}
          pendingIds={pendingIds}
        />
      )}
    </PageShell>
  );
}
