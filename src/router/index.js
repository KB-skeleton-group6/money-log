import "@/assets/main.css";

import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/auth",
      children: [
        { path: "login", component: () => import("@/views/auth/Login.vue") },
        { path: "signup", component: () => import("@/views/auth/Signup.vue") },
      ],
    },
    {
      path: "/ledger",
      component: () => import("@/layouts/LedgerLayout.vue"),
      redirect: "/ledger/dashboard",
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

export default router;
