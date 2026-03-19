const shortDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDateID(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return shortDateFormatter.format(date);
}

export function toDateInputValue(value: Date = new Date()) {
  return value.toISOString().slice(0, 10);
}
