import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuKeys } from "./queries";
import { useToastStore } from "@/shared/ui/toast-store";
import type { MenuItem, StopItemPayload } from "@/types/menu";

async function parseErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? fallback;
}

async function stopMenuItemRequest(
  id: string,
  payload: StopItemPayload,
): Promise<MenuItem> {
  const res = await fetch(`/api/menu-items/${id}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(
      await parseErrorMessage(res, "Не удалось обновить позицию"),
    );
  }
  return res.json();
}

async function resumeMenuItemRequest(id: string): Promise<MenuItem> {
  const res = await fetch(`/api/menu-items/${id}/resume`, { method: "POST" });
  if (!res.ok) {
    throw new Error(
      await parseErrorMessage(res, "Не удалось вернуть позицию в продажу"),
    );
  }
  return res.json();
}

export function useStopItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationKey: ["stop-item"],
    mutationFn: (vars: { id: string; payload: StopItemPayload }) =>
      stopMenuItemRequest(vars.id, vars.payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.list });
      const previous = queryClient.getQueryData<MenuItem[]>(menuKeys.list);

      queryClient.setQueryData<MenuItem[]>(menuKeys.list, (items = []) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: { kind: "stopped", ...payload },
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      return { previous };
    },

    onError: (error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(menuKeys.list, context.previous);
      }
      showToast(
        error instanceof Error ? error.message : "Не удалось обновить позицию",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}

export function useResumeItem() {
  const queryClient = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationKey: ["resume-item"],
    mutationFn: (id: string) => resumeMenuItemRequest(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.list });
      const previous = queryClient.getQueryData<MenuItem[]>(menuKeys.list);

      queryClient.setQueryData<MenuItem[]>(menuKeys.list, (items = []) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: { kind: "available" },
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      return { previous };
    },

    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(menuKeys.list, context.previous);
      }
      showToast(
        error instanceof Error
          ? error.message
          : "Не удалось вернуть позицию в продажу",
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.all });
    },
  });
}
