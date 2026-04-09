<script setup>
import { useLedgerLayoutStore } from "@/stores/ledger";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const layoutStore = useLedgerLayoutStore();
const route = useRoute();

const title = computed(() => layoutStore.currentPage.title);
const desc = computed(() => {
  if (route.path === "/ledger/dashboard") {
    return new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }
  return layoutStore.currentPage.desc;
});

const userName = ref("홍길동");
</script>

<template>
  <div class="ledger-layout-header">
    <div class="header-left">
      <div class="title">{{ title }}</div>
      <div class="desc">{{ desc }}</div>
    </div>
    <div class="header-right">
      <div class="alarm">
        <i class="fa-regular fa-bell"></i>
      </div>
      <div class="profile">
        <div class="avatar">
          <i class="fa-regular fa-user"></i>
        </div>
        <span>{{ userName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ledger-layout-header {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding: 16px;
}

@media (max-width: 768px) {
  .ledger-layout-header {
    display: none;
  }
}

.header-left {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
}

.header-left .title {
  font-size: 20px;
  font-weight: bold;
}

.header-left .desc {
  font-size: 14px;
  color: #8ea2b7;
}

.header-right {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 24px;
  padding: 0 8px;
}

.header-right .alarm {
}

.header-right .profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.header-right .profile .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #00c78b;
  background-color: #00c78b64;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right .profile span {
  font-size: 14px;
}
</style>
