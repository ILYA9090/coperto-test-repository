import { NextResponse } from "next/server";
import { resumeMenuItem } from "@/server/menu-store";
import { simulateMutation } from "@/server/simulate";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await simulateMutation();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }

  const result = resumeMenuItem(id);

  if (!result.ok) {
    switch (result.reason) {
      case "not_found":
        return NextResponse.json(
          { error: "Позиция не найдена" },
          { status: 404 },
        );
      case "out_of_stock":
        return NextResponse.json(
          { error: "Нельзя вернуть в продажу: остаток равен нулю" },
          { status: 409 },
        );
    }
  }

  return NextResponse.json(result.item);
}
