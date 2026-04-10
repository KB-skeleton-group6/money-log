<script setup>
const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <div class="modal-container">
    <div class="logout-modal">
      <div class="header">
        <div class="icon-box">
          <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <div class="title-box">
          <div class="title">로그아웃</div>
          <div class="desc">정말 로그아웃 하시겠습니까?</div>
        </div>
        <div class="close-btn-box">
          <button class="close-btn" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="content">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>로그아웃하면 현재 세션이 종료됩니다.</p>
      </div>
      <div class="buttons">
        <button class="cancel-btn" @click="emit('close')">취소</button>
        <button class="confirm-btn" @click="emit('confirm')">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.logout-modal {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
  max-width: 400px;
  width: 100%;
}

.header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  padding: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(240, 240, 240);
}

.header > .icon-box {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: rgb(240, 240, 240);
}

.header > .icon-box > i {
  font-size: 12px;
  color: rgb(114, 114, 114);
}

.header > .title-box {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
}

.header > .title-box > .title {
  flex: 0 0 auto;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.header > .title-box > .desc {
  flex: 0 0 auto;
  margin: 0;
  font-size: 12px;
  color: rgb(153, 153, 153);
}

.header > .close-btn-box {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.header > .close-btn-box > button {
  flex: 0 0 auto;
  background: none;
  border: none;
  cursor: pointer;
}

.header > .close-btn-box > button > i {
  font-size: 12px;
  color: rgb(153, 153, 153);
}

.content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  background-color: rgb(248, 248, 248);
}

.content > i {
  font-size: 14px;
  color: rgb(153, 153, 153);
}

.content > p {
  margin: 0;
  font-size: 13px;
  color: rgb(114, 114, 114);
}

.buttons {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
}

.buttons > button {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 10px;
  padding: 12px 8px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.buttons > .confirm-btn {
  background-color: #00c78b;
  color: white;
  border-color: #00c78b;
}

@media (max-width: 768px) {
  .logout-modal {
    width: calc(100% - 32px);
  }
}
</style>
