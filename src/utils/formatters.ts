// Format currency in Pakistani Rupees (PKR)
export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 روپے';
  return `${new Intl.NumberFormat('ur-PK').format(Math.round(amount))} روپے`;
}

// Format Maunds (من)
export function formatMaunds(maunds: number): string {
  if (isNaN(maunds) || maunds === null || maunds === undefined) return '0 من';
  return `${new Intl.NumberFormat('ur-PK').format(maunds)} من`;
}

// Format general numbers with commas
export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('ur-PK').format(val);
}

// Convert English digits to Urdu/Eastern Arabic digits if desired, or clean readable numerals
export function toUrduDigits(num: number | string): string {
  const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => urduDigits[+w]);
}

// Format date into readable Urdu text
export function formatUrduDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const monthsUrdu = [
      'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
      'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
    ];
    return `${d.getDate()} ${monthsUrdu[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}
