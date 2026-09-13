import { NextResponse } from "next/server";
import { getMenuItems } from "@/server/menu-store";

const LIST_DELAY_MS = 600;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await delay(LIST_DELAY_MS);
  const items = getMenuItems();
  return NextResponse.json(items);
}
