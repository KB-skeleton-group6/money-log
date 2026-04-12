export const PAYMENT_METHOD_UI = {
  CREDIT_CARD: {
    color: "#1E90FF",
    subColor: "#E1F5FE",
    icon: "fa-solid fa-credit-card",
  },
  CHECK_CARD: {
    color: "#00CED1",
    subColor: "#E0F7FA",
    icon: "fa-solid fa-wallet",
  },
  CASH: {
    color: "#2ECC71",
    subColor: "#E8F5E9",
    icon: "fa-solid fa-money-bill-wave",
  },
  BANK_TRANSFER: {
    color: "#9B59B6",
    subColor: "#F3E5F5",
    icon: "fa-solid fa-building-columns",
  },
  EASY_PAY: {
    color: "#F39C12",
    subColor: "#FFF3E0",
    icon: "fa-solid fa-mobile-screen-button",
  },
};

export const DEFAULT_PAYMENT_METHOD_UI = {
  color: "#808080",
  subColor: "#F3F4F6",
  icon: "fa-solid fa-money-check",
};

export const enrichPaymentMethod = (method) => ({
  ...method,
  ...(PAYMENT_METHOD_UI[method.code] ?? DEFAULT_PAYMENT_METHOD_UI),
});
