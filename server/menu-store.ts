import type { MenuItem, StopItemPayload } from "@/types/menu";

const seed: MenuItem[] = [
  {
    id: "1",
    title: "Борщ",
    shop: "kitchen",
    stock: 12,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Стейк рибай",
    shop: "kitchen",
    stock: 3,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Цезарь с курицей",
    shop: "kitchen",
    stock: 0,
    status: { kind: "stopped", reason: "out_of_stock", until: null },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Паста Карбонара",
    shop: "kitchen",
    stock: 8,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Пицца Маргарита",
    shop: "kitchen",
    stock: 5,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Морс клюквенный",
    shop: "bar",
    stock: 20,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Мохито безалкогольный",
    shop: "bar",
    stock: 15,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Эспрессо",
    shop: "bar",
    stock: 0,
    status: { kind: "stopped", reason: "equipment", until: null },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Лимонад цитрусовый",
    shop: "bar",
    stock: 10,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    title: "Чизкейк Нью-Йорк",
    shop: "pastry",
    stock: 6,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "11",
    title: "Тирамису",
    shop: "pastry",
    stock: 4,
    status: { kind: "stopped", reason: "quality", until: null },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Круассан миндальный",
    shop: "pastry",
    stock: 9,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "13",
    title: "Эклер шоколадный",
    shop: "pastry",
    stock: 7,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  },
];

let items: MenuItem[] = seed.map((item) => ({ ...item }));

export function getMenuItems(): MenuItem[] {
  return items.map((item) => ({ ...item }));
}

export type StopItemResult =
  | { ok: true; item: MenuItem }
  | { ok: false; reason: "not_found" };

export type ResumeItemResult =
  | { ok: true; item: MenuItem }
  | { ok: false; reason: "not_found" | "out_of_stock" };

export function stopMenuItem(
  id: string,
  payload: StopItemPayload,
): StopItemResult {
  const item = items.find((i) => i.id === id);
  if (!item) return { ok: false, reason: "not_found" };

  const updated: MenuItem = {
    ...item,
    status: { kind: "stopped", ...payload },
    updatedAt: new Date().toISOString(),
  };
  items = items.map((i) => (i.id === id ? updated : i));
  return { ok: true, item: updated };
}

export function resumeMenuItem(id: string): ResumeItemResult {
  const item = items.find((i) => i.id === id);
  if (!item) return { ok: false, reason: "not_found" };
  if (item.stock === 0) return { ok: false, reason: "out_of_stock" };

  const updated: MenuItem = {
    ...item,
    status: { kind: "available" },
    updatedAt: new Date().toISOString(),
  };
  items = items.map((i) => (i.id === id ? updated : i));
  return { ok: true, item: updated };
}
