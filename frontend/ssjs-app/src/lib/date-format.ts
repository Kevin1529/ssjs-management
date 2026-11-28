const dateOptions: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};

function parseDate(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value?: string) {
  return parseDate(value)?.toLocaleDateString("en-GB", dateOptions);
}

export function formatDateTime(value?: string) {
  return parseDate(value)?.toLocaleString("en-GB", dateTimeOptions);
}

/** Today as `YYYY-MM-DD`, for `<input type="date" max>` and comparisons. */
export function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}
