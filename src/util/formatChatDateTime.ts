export function formatChatDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = date.toLocaleDateString(); // always show date
  return `${dateStr} ${timeStr}`;
}
