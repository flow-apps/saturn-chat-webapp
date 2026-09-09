export function convertBytesToMB(bytes: number): string {
  if (!bytes || bytes <= 0) return "0.00 KB";

  const sizeInMB = bytes / 1024 / 1024;
  const isMB = sizeInMB >= 1;
  const value = isMB ? sizeInMB : sizeInMB * 1024;

  const userLocale = typeof window !== "undefined" ? navigator.language : "pt-BR";
  const decimalSeparator =
    new Intl.NumberFormat(userLocale)
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")?.value || ",";

  const formattedValue = value.toFixed(2).replace(".", decimalSeparator);
  const unit = isMB ? "MB" : "KB";

  return `${formattedValue} ${unit}`;
}