<script setup>
import { ref, defineEmits } from "vue";
import {
  isPasswordValid,
  isPasswordConfirmed,
} from "@/utils/validators/authValidator";

const emit = defineEmits(["close", "save"]);

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const errorMessage = ref("");

const changeCurrentPassword = (event) => {
  const value = event.target.value;

  currentPassword.value = value;
};

const changeNewPassword = (event) => {
  const value = event.target.value;

  newPassword.value = value;
};

const changeConfirmNewPassword = (event) => {
  const value = event.target.value;

  confirmNewPassword.value = value;
};

const saveChanges = () => {
  try {
    isPasswordValid(currentPassword.value);
    isPasswordValid(newPassword.value);
    isPasswordConfirmed(newPassword.value, confirmNewPassword.value);
    emit("save", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
  } catch (err) {
    let message = "알 수 없는 오류입니다.";
    if (err.name === "MemberInfoError") {
      switch (err.code) {
        case 6002:
          message = "비밀번호를 입력해주세요";
          break;
        case 6004:
          message = "비밀번호가 일치하지 않습니다. 비밀번호를 확인해주세요";
          break;
        case 6008:
          message =
            "비밀번호 형식이 올바르지 않습니다. (영문·숫자·특수문자 포함 8~20자)";
          break;
      }
    }
    errorMessage.value = message;
  }
};
</script>

<template>
  <div class="modal-container">
    <div class="change-password-modal">
      <div class="header">
        <div class="icon-box">
          <i class="fa-solid fa-lock"></i>
        </div>
        <div class="title-box">
          <div class="title">비밀번호 변경</div>
          <div class="desc">안전한 비밀번호를 비밀번호로 변경하세요</div>
        </div>
        <div class="close-btn-box">
          <button class="close-btn" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div class="content">
        <div class="content-item">
          <div class="label">현재 비밀번호<span>*</span></div>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock"></i>
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              :value="currentPassword"
              @input="changeCurrentPassword"
              placeholder="현재 비밀번호를 입력하세요"
            />
            <i
              class="fa-regular fa-eye"
              @click="showCurrentPassword = !showCurrentPassword"
            ></i>
          </div>
        </div>
        <div class="content-item">
          <div class="label">새 비밀번호<span>*</span></div>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock"></i>
            <input
              :type="showNewPassword ? 'text' : 'password'"
              :value="newPassword"
              @input="changeNewPassword"
              placeholder="8자 이상 20자 이하로 입력하세요"
            />
            <i
              class="fa-regular fa-eye"
              @click="showNewPassword = !showNewPassword"
            ></i>
          </div>
        </div>
        <div class="content-item">
          <div class="label">새 비밀번호 확인<span>*</span></div>
          <div class="input-wrapper">
            <i class="fa-solid fa-lock"></i>
            <input
              :type="showConfirmNewPassword ? 'text' : 'password'"
              :value="confirmNewPassword"
              @input="changeConfirmNewPassword"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            <i
              class="fa-regular fa-eye"
              @click="showConfirmNewPassword = !showConfirmNewPassword"
            ></i>
          </div>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      </div>
      <div class="buttons">
        <button class="cancel-btn" @click="emit('close')">취소</button>
        <button class="save-btn" @click="saveChanges">변경하기</button>
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

.change-password-modal {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
  max-width: 800px;
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
  background-color: #00c78b2f;
}

.header > .icon-box > i {
  font-size: 12px;
  color: #00c78b;
}

.header > .title-box {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
  min-width: 0;
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
}

.content > .content-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 8px;
  padding: 8px;
}

.content > .content-item > .label {
  flex: 0 0 auto;
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  color: rgb(114, 114, 114);
}

.content > .content-item > .label > span {
  color: red;
}

.content > .content-item > .input-wrapper {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
}

.content > .content-item > .input-wrapper > i {
  font-size: 12px;
  color: rgb(190, 190, 190);
}

.content > .content-item > .input-wrapper > input {
  flex: 1 1 auto;
  border: none;
  background: none;
  color: rgb(79, 79, 79);
}

.content > .content-item > .input-wrapper > input:focus {
  outline: none;
}

.content > .content-item > .input-wrapper > input::placeholder {
  color: rgb(153, 153, 153);
}

.error-message {
  flex: 0 0 auto;
  margin: 0;
  font-size: 12px;
  color: red;
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

.buttons > .save-btn {
  background-color: #00c78b;
  color: white;
}

@media (max-width: 768px) {
  .change-password-modal {
    width: calc(100% - 32px);
  }
}
</style>
