"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { stopPayloadSchema } from "@/shared/schemas/stop-item";
import type { StopPayloadInput } from "@/shared/schemas/stop-item";
import { Select } from "@/shared/ui/Select";
import { Button } from "@/shared/ui/Button";
import { useStopPanelStore } from "../model/stop-panel-store";
import { useStopItem } from "../model/use-stop-item";
import { menuItemsQueryOptions } from "../model/queries";
import { REASON_LABELS } from "../model/labels";
import type { StopReason } from "@/types/menu";

const REASON_OPTIONS = (
  Object.entries(REASON_LABELS) as [StopReason, string][]
).map(([value, label]) => ({ value, label }));

type UntilMode = "shift" | "specific";

function isoToLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputValueToIso(value: string): string {
  return new Date(value).toISOString();
}

export function StopReasonPanel() {
  const openItemId = useStopPanelStore((s) => s.openItemId);
  const close = useStopPanelStore((s) => s.close);
  const { data: items } = useQuery(menuItemsQueryOptions);
  const stopMutation = useStopItem();

  const item = items?.find((i) => i.id === openItemId) ?? null;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StopPayloadInput>({
    resolver: zodResolver(stopPayloadSchema),
    mode: "onBlur",
    defaultValues: { reason: "out_of_stock", until: null },
  });

  const untilValue = useWatch({ control, name: "until" });
  const untilMode: UntilMode = untilValue === null ? "shift" : "specific";

  useEffect(() => {
    if (!item) return;
    if (item.status.kind === "stopped") {
      reset({ reason: item.status.reason, until: item.status.until });
    } else {
      reset({ reason: "out_of_stock", until: null });
    }
  }, [item, reset]);

  useEffect(() => {
    if (!item) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [item, close]);

  if (!item) return null;

  function onSubmit(values: StopPayloadInput) {
    stopMutation.mutate({ id: item!.id, payload: values });
    close();
  }

  function handleModeChange(mode: UntilMode) {
    if (mode === "shift") {
      setValue("until", null, { shouldValidate: true });
    } else {
      setValue("until", "", { shouldValidate: false });
    }
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setValue("until", raw ? localInputValueToIso(raw) : "", {
      shouldValidate: true,
    });
  }

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Постановка в стоп-лист"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col gap-4 bg-background p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <button
                onClick={close}
                aria-label="Закрыть панель"
                className="text-foreground/60 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col gap-4"
            >
              <Select
                label="Причина"
                options={REASON_OPTIONS}
                error={errors.reason?.message}
                {...register("reason")}
              />

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium text-foreground">
                  Срок
                </legend>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="untilMode"
                    checked={untilMode === "shift"}
                    onChange={() => handleModeChange("shift")}
                  />
                  До конца смены
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="untilMode"
                    checked={untilMode === "specific"}
                    onChange={() => handleModeChange("specific")}
                  />
                  Конкретное время
                </label>

                {untilMode === "specific" && (
                  <input
                    type="datetime-local"
                    step={900}
                    defaultValue={
                      untilValue ? isoToLocalInputValue(untilValue) : ""
                    }
                    onChange={handleTimeChange}
                    className={`rounded-md border px-3 py-2 text-sm ${
                      errors.until ? "border-accent" : "border-foreground/15"
                    }`}
                  />
                )}

                {errors.until && (
                  <p className="text-sm text-accent">{errors.until.message}</p>
                )}
              </fieldset>

              <div className="mt-auto flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={close}>
                  Отмена
                </Button>
                <Button type="submit" variant="primary">
                  Сохранить
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
