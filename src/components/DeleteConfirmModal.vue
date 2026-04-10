<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-content">
        <div class="icon-circle">
          <i class="far fa-trash-alt"></i>
        </div>
        <h3 class="modal-title">거래를 삭제할까요?</h3>
        <p class="modal-desc">삭제된 거래는 복구할 수 없습니다.</p>
        <div class="button-group">
          <button class="btn btn-cancel" @click="$emit('cancel')">취소</button>
          <button class="btn btn-delete" @click="$emit('confirm')">삭제</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, required: true },
});
defineEmits(['cancel', 'confirm']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(136, 142, 156, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-content {
  background: #ffffff;
  width: 320px;
  padding: 32px 24px 24px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: popIn 0.2s ease-out;
}
.icon-circle {
  width: 56px;
  height: 56px;
  background-color: #fff0f2;
  color: #ff3b60;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  margin: 0 auto 20px;
}
.modal-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}
.modal-desc {
  margin: 0 0 28px 0;
  font-size: 14px;
  color: #888;
}
.button-group {
  display: flex;
  gap: 12px;
}
.btn {
  flex: 1;
  padding: 14px 0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel {
  background-color: #ffffff;
  color: #555;
  border: 1.5px solid #e2e8f0;
}
.btn-cancel:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}
.btn-delete {
  background-color: #ff3b60;
  color: #ffffff;
  border: none;
}
.btn-delete:hover {
  background-color: #e0284b;
}
@keyframes popIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
