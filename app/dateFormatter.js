export function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();
  return `${month} ${day}`;
}
