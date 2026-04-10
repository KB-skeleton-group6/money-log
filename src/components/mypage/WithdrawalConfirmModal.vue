<script setup>
const emit = defineEmits(["close", "confirm"]);
</script>

<template>
  <div class="modal-container">
    <div class="withdrawal-modal">
      <div class="header">
        <div class="icon-box">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="title-box">
          <div class="title">회원 탈퇴</div>
          <div class="desc">탈퇴 전 아래 내용을 반드시 확인하세요</div>
        </div>
        <div class="close-btn-box">
          <button class="close-btn" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="content">
        <div class="warning-box">
          <div class="warning-item">
            <i class="fa-solid fa-circle-xmark"></i>
            <span>탈퇴 시 모든 가계부 데이터가 <strong>영구 삭제</strong>됩니다.</span>
          </div>
          <div class="warning-item">
            <i class="fa-solid fa-circle-xmark"></i>
            <span>삭제된 데이터는 <strong>복구할 수 없습니다.</strong></span>
          </div>
          <div class="warning-item">
            <i class="fa-solid fa-circle-xmark"></i>
            <span>탈퇴 후 동일 이메일로 재가입이 가능합니다.</span>
          </div>
        </div>
        <div class="confirm-text">정말로 탈퇴하시겠습니까?</div>
      </div>
      <div class="buttons">
        <button class="cancel-btn" @click="emit('close')">취소</button>
        <button class="confirm-btn" @click="emit('confirm')">탈퇴하기</button>
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

.withdrawal-modal {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
  max-width: 800px;
  min-width: 0;
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
  background-color: #ff4d4f2f;
}

.header > .icon-box > i {
  font-size: 12px;
  color: #ff4d4f;
}

.header > .title-box {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
  min-width: 260px;
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
  flex-direction: column;
  gap: 12px;
  padding: 4px 8px;
}

.warning-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background-color: #fff5f5;
  border: 1px solid #ffd6d6;
}

.warning-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgb(79, 79, 79);
}

.warning-item > i {
  font-size: 12px;
  color: #ff4d4f;
  flex: 0 0 auto;
}

.warning-item > span > strong {
  color: #ff4d4f;
}

.confirm-text {
  font-size: 13px;
  font-weight: bold;
  color: rgb(79, 79, 79);
  text-align: center;
  padding: 4px 0;
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
  background-color: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
}

@media (max-width: 768px) {
  .withdrawal-modal {
    width: calc(100% - 32px);
  }
}
</style>
