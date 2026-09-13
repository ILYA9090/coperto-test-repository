import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useStopItem } from "../use-stop-item";
import { menuKeys } from "../queries";
import { useToastStore } from "@/shared/ui/toast-store";
import type { MenuItem } from "@/types/menu";

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return { wrapper, queryClient };
}

const initialItems: MenuItem[] = [
  {
    id: "3",
    title: "Цезарь с курицей",
    shop: "kitchen",
    stock: 5,
    status: { kind: "available" },
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("useStopItem", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("применяет оптимистичное обновление сразу, а при ошибке сервера откатывает к прежнему состоянию", async () => {
    const deferred = createDeferred<Response>();
    global.fetch = vi
      .fn()
      .mockReturnValue(deferred.promise) as unknown as typeof fetch;

    const { wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(menuKeys.list, initialItems);

    const { result } = renderHook(() => useStopItem(), { wrapper });

    act(() => {
      result.current.mutate({
        id: "3",
        payload: { reason: "equipment", until: null },
      });
    });

    await waitFor(() => {
      const data = queryClient.getQueryData<MenuItem[]>(menuKeys.list);
      const item = data?.find((i) => i.id === "3");
      expect(item?.status.kind).toBe("stopped");
    });

    deferred.resolve({
      ok: false,
      json: async () => ({ error: "Сервис временно недоступен" }),
    } as Response);

    await waitFor(() => {
      const data = queryClient.getQueryData<MenuItem[]>(menuKeys.list);
      const item = data?.find((i) => i.id === "3");
      expect(item?.status.kind).toBe("available");
    });
  });
});
