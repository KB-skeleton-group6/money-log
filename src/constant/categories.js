export const CATEGORY_UI = {
  FOOD:         { color: '#FF6B00', subColor: '#FFD700', icon: 'fa-solid fa-utensils' },
  CAFE:         { color: '#FFD979', subColor: '#FFFACD', icon: 'fa-solid fa-mug-hot' },
  TRANSPORT:    { color: '#00BFFF', subColor: '#B0E0E6', icon: 'fa-solid fa-bus' },
  SHOPPING:     { color: '#FF0000', subColor: '#FFB6C1', icon: 'fa-solid fa-bag-shopping' },
  GROCERIES:    { color: '#D2691E', subColor: '#F4A460', icon: 'fa-solid fa-basket-shopping' },
  SUBSCRIPTION: { color: '#9370DB', subColor: '#E6E6FA', icon: 'fa-solid fa-tv' },
  HEALTH:       { color: '#00FA9A', subColor: '#AFEEEE', icon: 'fa-solid fa-heartbeat' },
  EDUCATION:    { color: '#0000CD', subColor: '#ADD8E6', icon: 'fa-solid fa-graduation-cap' },
  LEISURE:      { color: '#9C88FF', subColor: '#D8BFD8', icon: 'fa-solid fa-gamepad' },
  ETC_EXPENSE:  { color: '#808080', subColor: '#D3D3D3', icon: 'fa-solid fa-ellipsis-h' },
  SALARY:       { color: '#1E90FF', subColor: '#87CEFA', icon: 'fa-solid fa-money-check-dollar' },
  SIDE_JOB:     { color: '#00CED1', subColor: '#AFEEEE', icon: 'fa-solid fa-briefcase' },
  INVESTMENT:   { color: '#008000', subColor: '#90EE90', icon: 'fa-solid fa-chart-line' },
  ALLOWANCE:    { color: '#7FFF00', subColor: '#F0FFF0', icon: 'fa-solid fa-piggy-bank' },
  ETC_INCOME:   { color: '#808080', subColor: '#D3D3D3', icon: 'fa-solid fa-ellipsis-h' },
};

export const DEFAULT_CATEGORY_UI = {
  color: '#808080',
  subColor: '#D3D3D3',
  icon: 'fa-solid fa-circle-question',
};

export const enrichCategory = (cat) => ({
  ...cat,
  ...(CATEGORY_UI[cat.code] ?? DEFAULT_CATEGORY_UI),
});
