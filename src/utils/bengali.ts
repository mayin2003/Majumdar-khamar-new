const bengaliDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export function toBengaliNumber(num: number | string): string {
  if (num === null || num === undefined) return '';
  let numStr = num.toString().trim();
  const parsed = Number(numStr.replace(/,/g, ''));
  if (!isNaN(parsed) && numStr !== '') {
    numStr = parsed.toLocaleString('en-US');
  }
  return numStr
    .split('')
    .map((char) => bengaliDigits[char] || char)
    .join('');
}

export function formatPriceBDT(price: number | string): string {
  if (price === null || price === undefined || price === '') return '৳ ০';
  if (typeof price === 'string' && price.startsWith('৳')) {
    return price;
  }
  return `৳ ${toBengaliNumber(price)}`;
}
