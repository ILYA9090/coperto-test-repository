import type { Shop, StopReason } from "@/types/menu";

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: "Кухня",
  bar: "Бар",
  pastry: "Кондитерская",
};

export const REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: "Закончились продукты",
  equipment: "Сломалось оборудование",
  quality: "Вопросы к качеству",
  menu_change: "Снято с меню",
};
