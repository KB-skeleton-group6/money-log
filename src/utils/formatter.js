/**
 * 숫자를 천 단위 구분 쉼표가 포함된 금액 문자열로 변환
 * 예: 1250000 -> "1,250,000"
 */
export function formatAmount(amount) {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('ko-KR').format(amount);
}

/**
 * 날짜 객체나 문자열을 가계부용 포맷으로 변환
 * 예: "2026-04-08T..." -> "2026년 04월 08일"
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * 숫자를 만/억/조/경 단위로 축약한 금액 문자열로 변환
 * 예: 12500000 -> "1,250만원", 100000000 -> "1억원", 150000000 -> "1억 5,000만원"
 */
export function formatAmountShort(amount) {
  if (isNaN(amount)) return '0원';
  const fmt = (n) => new Intl.NumberFormat('ko-KR').format(n);
  const units = [
    { value: 10000000000000000n, label: '경' },
    { value: 1000000000000n,     label: '조' },
    { value: 100000000n,         label: '억' },
    { value: 10000n,             label: '만' },
  ];
  const big = BigInt(Math.floor(amount));
  if (big >= 10000000000000000n * 100n) return '99경+';
  const parts = [];
  let remainder = big;
  for (const { value, label } of units) {
    const q = remainder / value;
    remainder = remainder % value;
    if (q > 0n) parts.push(`${fmt(Number(q))}${label}`);
  }
  if (remainder > 0n || parts.length === 0) parts.push(fmt(Number(remainder)));
  return parts.join(' ') + '원';
}

/**
 * 퍼센트 계산 (도넛 차트나 프로그레스 바용)
 */
export function calculatePercent(value, total) {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
}
