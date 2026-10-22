// Dates in content are ISO "YYYY-MM-DD"; format them in UTC so SSR and client agree.
export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${isoDate}T00:00:00Z`),
  );
}
