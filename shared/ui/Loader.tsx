export function Loader() {
  return (
    <div className="flex justify-center py-32">
      <div
        role="status"
        aria-label="Загрузка"
        className="h-16 w-16 animate-spin rounded-full border-4 border-foreground/20 border-t-accent"
      />
    </div>
  );
}
