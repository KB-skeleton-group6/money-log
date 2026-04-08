<script setup></script>

<template>
  <div class="budget-section">
    <h3>계정 관리</h3>
    <div class="buttons">
      <button class="change-password-btn">
        <i class="fa-solid fa-lock"></i>
        <span>비밀번호 변경</span>
      </button>
      <button class="logout-btn">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>로그아웃</span>
      </button>
      <div class="divider"></div>
      <button class="withdrawal-btn">
        <i class="fa-regular fa-trash-can"></i>
        <span>회원 탈퇴</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.budget-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

.budget-section h3 {
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
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
  padding: 8px 16px;
  color: rgb(46, 46, 46);
  background-color: white;
}

.buttons > button.withdrawal-btn {
  border: 1px solid red;
  color: red;
}
</style>
