
export function formatDate(date: Date | string, format: 'YYYY-MM-DD' | 'DD.MM.YYYY' = 'DD.MM.YYYY'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'DD.MM.YYYY') {
    return `${day}.${month}.${year}`;
  } else {
    throw new Error('Unsupported format type');
  }
}


export function formatTime(time: string): string {
  return time.slice(0, 5);
};


export function formatTimeToDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = '00';
  return `${hours}:${minutes}:${seconds}`;
};