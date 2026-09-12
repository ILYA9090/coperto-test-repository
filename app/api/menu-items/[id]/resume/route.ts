import { NextResponse } from "next/server";
import { resumeMenuItem } from "@/server/menu-store";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  await delay(600);

  if (Math.random() < 0.2) {
    return NextResponse.json(
      { error: "Не удалось вернуть позицию в продажу" },
      { status: 500 },
    );
  }

  const result = resumeMenuItem(id);

  if (!result.ok) {
    const status = result.reason === "not_found" ? 404 : 409;
    const message =
      result.reason === "not_found"
        ? "Позиция не найдена"
        : "Нельзя вернуть в продажу: остаток равен нулю";
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json(result.item);
}
