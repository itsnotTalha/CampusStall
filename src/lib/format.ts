const bdtFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

export function formatBdt(amount: number) {
  return `৳${bdtFormatter.format(amount)}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}
