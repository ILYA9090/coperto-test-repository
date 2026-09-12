import { parseFilters } from "@/features/stop-list/model/filters";
import { StopListPage } from "@/features/stop-list/ui/StopListPage";

export default async function Home({ searchParams }: PageProps<"/">) {
  const filters = parseFilters(await searchParams);

  return <StopListPage filters={filters} />;
}
