export const databaseIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function readDatabaseId(value: FormDataEntryValue | null) {
  return typeof value === "string" && databaseIdPattern.test(value)
    ? value
    : null;
}
