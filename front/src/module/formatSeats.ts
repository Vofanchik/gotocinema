
export function formatSeatString(seatString: string): string {
  const [row, seat] = seatString.split('-').map(Number); // Преобразуем строки в числа
  return `Ряд ${row + 1} - место ${seat + 1}`;
}
