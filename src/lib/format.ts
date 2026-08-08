const bdtFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

export function formatBdt(amount: number) {
  return `৳${bdtFormatter.format(amount)}`;
}
