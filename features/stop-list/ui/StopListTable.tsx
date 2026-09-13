"use client";

import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { SHOP_LABELS, REASON_LABELS } from "../model/labels";
import { formatUntil } from "../model/format";
import type { MenuItem } from "@/types/menu";

interface StopListTableProps {
  items: MenuItem[];
  onStopClick: (item: MenuItem) => void;
  onResumeClick: (item: MenuItem) => void;
  onEditClick: (item: MenuItem) => void;
  pendingIds: ReadonlySet<string>;
}

export function StopListTable({
  items,
  onStopClick,
  onResumeClick,
  onEditClick,
  pendingIds,
}: StopListTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-foreground/10 text-left text-foreground/60">
          <th className="py-2 pr-4 font-medium">Позиция</th>
          <th className="py-2 pr-4 font-medium">Цех</th>
          <th className="py-2 pr-4 font-medium">Остаток</th>
          <th className="py-2 pr-4 font-medium">Статус</th>
          <th className="py-2 pr-4 font-medium">
            <span className="sr-only">Действия</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const { status } = item;
          const isPending = pendingIds.has(item.id);
          const cannotResume = item.stock === 0;

          return (
            <tr
              key={item.id}
              className={`border-b border-foreground/5 transition-colors duration-300 ${status.kind === "stopped" ? "text-foreground/50" : ""}`}
            >
              <td className="py-3 pr-4">{item.title}</td>
              <td className="py-3 pr-4">{SHOP_LABELS[item.shop]}</td>
              <td className="py-3 pr-4">{item.stock}</td>
              <td className="py-3 pr-4">
                {status.kind === "stopped" && (
                  <button
                    type="button"
                    onClick={() => onEditClick(item)}
                    className="rounded-full"
                    aria-label="Изменить причину и срок стопа"
                  >
                    <Badge variant="stopped">
                      {REASON_LABELS[status.reason]} ·{" "}
                      {formatUntil(status.until)}
                    </Badge>
                  </button>
                )}
                <Badge
                  variant="neutral"
                  className={`ml-2 ${isPending ? "" : "invisible"}`}
                >
                  сохраняется…
                </Badge>
              </td>
              <td className="py-3 pr-4 text-right">
                {status.kind === "stopped" ? (
                  <span
                    title={
                      cannotResume
                        ? "Нельзя вернуть в продажу: остаток равен нулю"
                        : undefined
                    }
                  >
                    <Button
                      variant="secondary"
                      isLoading={isPending}
                      disabled={cannotResume}
                      onClick={() => onResumeClick(item)}
                      className="w-44"
                    >
                      Вернуть в продажу
                    </Button>
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    isLoading={isPending}
                    onClick={() => onStopClick(item)}
                    className="w-44"
                  >
                    Поставить в стоп
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
