import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useLedgerLayoutStore = defineStore("ledger-layout", () => {
  const pages = [
    {
      to: { path: "/ledger/dashboard" },
      icon: "fa-solid fa-house",
      title: "홈",
    },
    {
      to: { path: "/ledger/mypage" },
      icon: "fa-solid fa-user",
      title: "마이페이지",
      desc: "내 정보와 설정을 관리하세요",
    },
    {
      to: { path: "/ledger/transactions" },
      icon: "fa-solid fa-left-right",
      title: "거래내역",
      desc: "수입과 지출 내역을 조회하고 관리하세요",
    },
    {
      to: { path: "/ledger/stat" },
      icon: "fa-solid fa-chart-simple",
      title: "통계",
      desc: "수입과 지출 패턴을 분석하세요",
    },
  ];

  const route = useRoute();
  const menuOpen = ref(false);

  const currentPage = computed(() => {
    const page = pages.find((page) => page.to.path === route.path);
    return { ...page };
  });

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
  };

  return {
    pages: computed(() => structuredClone(pages)),
    menuOpen: computed(() => menuOpen.value),
    currentPage,
    toggleMenu,
  };
});
