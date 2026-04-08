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
 * 퍼센트 계산 (도넛 차트나 프로그레스 바용)
 */
export function calculatePercent(value, total) {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
}
