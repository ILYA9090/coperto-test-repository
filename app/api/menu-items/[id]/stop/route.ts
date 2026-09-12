import { NextResponse } from "next/server";
import { stopPayloadSchema } from "@/shared/schemas/stop-item";
import { stopMenuItem } from "@/server/menu-store";
import { simulateMutation } from "@/server/simulate";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = stopPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  try {
    await simulateMutation();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const result = stopMenuItem(id, parsed.data);

  if (!result.ok) {
    return NextResponse.json({ error: "Позиция не найдена" }, { status: 404 });
  }

  return NextResponse.json(result.item);
}
