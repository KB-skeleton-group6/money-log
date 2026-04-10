<script setup>
import ChangePasswordModal from "@/components/mypage/ChangePasswordModal.vue";
import LogoutConfirmModal from "@/components/mypage/LogoutConfirmModal.vue";
import WithdrawalConfirmModal from "@/components/mypage/WithdrawalConfirmModal.vue";
import { useAuthStore } from "@/stores/auth/useAuthStore";

import { ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const isChangePasswordModalOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isWithdrawalModalOpen = ref(false);

const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true;
};

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false;
};

const openLogoutModal = () => {
  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const openWithdrawalModal = () => {
  isWithdrawalModalOpen.value = true;
};

const closeWithdrawalModal = () => {
  isWithdrawalModalOpen.value = false;
};

const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    await authStore.changePassword({
      currentPassword,
      newPassword,
    });
    closeChangePasswordModal();
  } catch (error) {
    if (error.name === "MemberInfoError") {
    } else {
    }
  }
};

const logout = async () => {
  authStore.logout();
  router.push("/");
  closeLogoutModal();
};

const withdraw = async () => {
  authStore.withdraw();
  router.push("/");
  closeWithdrawalModal();
};
</script>

<template>
  <div class="account-section">
    <h3>계정 관리</h3>
    <div class="buttons">
      <button class="change-password-btn" @click="openChangePasswordModal">
        <i class="fa-solid fa-lock"></i>
        <span>비밀번호 변경</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </button>
      <button class="logout-btn" @click="openLogoutModal">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>로그아웃</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </button>
      <div class="divider"></div>
      <button class="withdrawal-btn" @click="openWithdrawalModal">
        <i class="fa-regular fa-trash-can"></i>
        <span>회원 탈퇴</span>
        <i class="fa-solid fa-chevron-right chevron"></i>
      </button>
    </div>
    <Teleport to="body">
      <ChangePasswordModal
        v-if="isChangePasswordModalOpen"
        @save="changePassword"
        @close="closeChangePasswordModal"
      />
      <LogoutConfirmModal
        v-if="isLogoutModalOpen"
        @confirm="logout"
        @close="closeLogoutModal"
      />
      <WithdrawalConfirmModal
        v-if="isWithdrawalModalOpen"
        @confirm="withdraw"
        @close="closeWithdrawalModal"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.account-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

.account-section h3 {
  flex: 0 0 auto;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.buttons {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  gap: 8px;
}

.buttons > .divider {
  flex: 1 1 auto;
}

.buttons > button {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  border: 1px solid #e8e8ed;
  border-radius: 8px;
  padding: 8px 16px;
  color: #1c1c1e;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buttons > button.withdrawal-btn {
  border: 1px solid red;
  color: red;
}

.chevron {
  display: none;
}

@media (max-width: 768px) {
  .buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .buttons > .divider {
    flex: 0 0 auto;
    height: 1px;
    background-color: #d1d1d6;
  }

  .buttons > button,
  .buttons > button.withdrawal-btn {
    width: 100%;
    justify-content: start;
    border: none;
    border-radius: 0;
    padding: 14px 8px;
  }

  .chevron {
    display: block;
  }

  .buttons > button .chevron {
    margin-left: auto;
    font-size: 11px;
    color: #aeaeb2;
  }

  .buttons > button.withdrawal-btn .chevron {
    color: rgb(255, 150, 150);
  }
}
</style>
