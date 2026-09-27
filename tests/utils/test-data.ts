export function uniqueTitle(prefix = "Task"): string {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
}
