// 카테고리 이름에 맞춰 폰트어썸 아이콘 반환
export const getCategoryIcon = (categoryName) => {
  const iconMap = {
    식비: 'fas fa-utensils',
    카페: 'fas fa-coffee',
    교통: 'fas fa-bus',
    쇼핑: 'fas fa-shopping-bag',
    식료품: 'fas fa-shopping-cart',
    구독: 'fas fa-play-circle',
    건강: 'fas fa-heartbeat',
    교육: 'fas fa-book',
    여가: 'fas fa-gamepad',
    급여: 'fas fa-money-check-alt',
    부업: 'fas fa-laptop-house',
    투자: 'fas fa-chart-line',
    용돈: 'fas fa-hand-holding-usd',
  };
  return iconMap[categoryName] || 'fas fa-check-circle';
};

// DB 헥스코드를 연한 파스텔톤 배경색으로 변환 (투명도 12% 적용)
export const getLightBackgroundColor = (hexColor) => {
  if (!hexColor) return '#f5f5f5';
  return hexColor + '20';
};
