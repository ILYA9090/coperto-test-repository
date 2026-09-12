import { NextResponse } from "next/server";
import { getMenuItems } from "@/server/menu-store";

const LIST_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  await delay(LIST_DELAY_MS);

  const { searchParams } = new URL(request.url);
  const simulate = searchParams.get("simulate");

  if (simulate === "error") {
    return NextResponse.json(
      { error: "Не удалось загрузить меню" },
      { status: 500 },
    );
  }

  if (simulate === "empty") {
    return NextResponse.json([]);
  }

  const items = getMenuItems();
  return NextResponse.json(items);
}
