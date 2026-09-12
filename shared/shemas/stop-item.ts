import { z } from "zod";

export const stopPayloadSchema = z.object({
  reason: z.enum(["out_of_stock", "equipment", "quality", "menu_change"]),
  until: z.iso.datetime().nullable(),
});

export type StopPayloadInput = z.infer<typeof stopPayloadSchema>;
