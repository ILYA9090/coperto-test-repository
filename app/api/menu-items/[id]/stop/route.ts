import { NextResponse } from "next/server";
import { stopMenuItem } from "@/server/menu-store";
import { stopPayloadSchema } from "@/shared/shemas/stop-item";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const parsed = stopPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  await delay(600);

  if (Math.random() < 0.2) {
    return NextResponse.json(
      { error: "Не удалось обновить позицию" },
      { status: 500 },
    );
  }

  const result = stopMenuItem(id, parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: "Позиция не найдена" }, { status: 404 });
  }

  return NextResponse.json(result.item);
}
