import "@/assets/main.css";

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth/useAuthStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/LandingLayout.vue"),
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/Home.vue"),
        },
        {
          path: ":pathMatch(.*)*",
          name: "NotFound",
          component: () => import("@/views/NotFound.vue"),
        },
      ],
    },
    {
      path: "/ledger",
      name: "Ledger",
      component: () => import("@/layouts/LedgerLayout.vue"),
      redirect: "/ledger/dashboard",
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          component: () => import("@/views/ledger/Dashboard.vue"),
        },
        {
          path: "mypage",
          component: () => import("@/views/ledger/MyPage.vue"),
        },
        {
          path: "transactions",
          component: () => import("@/views/ledger/Transactions.vue"),
        },
        {
          path: "stat",
          component: () => import("@/views/ledger/Statistic.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      return { name: "Home" };
    }
  }
});

export default router;
