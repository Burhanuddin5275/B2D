export const formatDateUS = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);

  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-indexed months
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${month}/${day}/${year} ${hours}-${minutes}-${seconds} ${ampm}`;
};
