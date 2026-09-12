export function formatUntil(until: string | null): string {
  if (until === null) return "до конца смены";
  return new Date(until).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
