<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  isEmailValid,
  isNameValid,
  isPasswordValid,
  MemberInfoError as AuthError,
} from '@/utils/validators/authValidator';

import { useAuthStore } from '@/stores/useAuthStore';

const emit = defineEmits(['close']);
const isLoginMode = ref(true); // true: 로그인 모드, false: 회원가입 모드
const showPassword = ref(false); // 비밀번호 표시 여부

// 폼 데이터 상태
const email = ref('');
const name = ref('');
const password = ref('');
const errorMessage = ref('');

const router = useRouter();

// 사용자가 다시 타이핑을 시작하면 에러 메시지 숨김
watch([email, name, password], () => {
  if (errorMessage.value) {
    errorMessage.value = '';
  }
});

const passwordPlaceholder = computed(() =>
  isLoginMode.value ? '비밀번호를 입력하세요' : '8자 이상 입력하세요',
);
const submitBtnText = computed(() =>
  isLoginMode.value ? '로그인' : '가입하기',
);

// 탭 전환 시 상태 및 폼 데이터 초기화
const setMode = (mode) => {
  if (isLoginMode.value === mode) return; // 같은 탭 클릭 시 무시

  isLoginMode.value = mode;
  errorMessage.value = '';

  email.value = '';
  name.value = '';
  password.value = '';
  showPassword.value = false;
};

// AuthModal.vue 수정
const handleSubmit = async () => {
  errorMessage.value = '';

  try {
    isEmailValid(email.value);
    if (!isLoginMode.value) {
      isNameValid(name.value);
    }
    isPasswordValid(password.value);

    const authStore = useAuthStore();

    if (isLoginMode.value) {
      // 1. 로그인 모드
      await authStore.login(email.value, password.value);
      emit('close');
      router.push('/ledger/dashboard');
    } else {
      // 2. 회원가입 모드
      await authStore.signup(email.value, password.value, name.value);
      alert('회원가입이 완료되었습니다. 로그인해 주세요!');
      emit('close');
    }
  } catch (error) {
    if (error instanceof AuthError) {
      errorMessage.value = error.message;
    }
  }
};
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-top">
          <div class="logo"><i class="fa-solid fa-wallet"></i> 머니로그</div>
          <button class="close-btn" @click="emit('close')">&times;</button>
        </div>

        <!-- 로그인 / 회원가입 토글 탭 -->
        <div class="auth-tabs">
          <div class="tab-slider" :class="{ 'is-signup': !isLoginMode }"></div>
          <button
            :class="['tab-btn', { active: isLoginMode }]"
            @click="setMode(true)"
          >
            로그인
          </button>
          <button
            :class="['tab-btn', { active: !isLoginMode }]"
            @click="setMode(false)"
          >
            회원가입
          </button>
        </div>
      </div>

      <div class="modal-body">
        <!-- 폼 영역 -->
        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="input-group">
            <label class="input-label"
              >이메일 <span class="required">*</span></label
            >
            <input
              type="email"
              v-model="email"
              placeholder="example@email.com"
              class="form-input"
            />
          </div>
          <div v-if="!isLoginMode" class="input-group">
            <label class="input-label"
              >이름 <span class="required">*</span></label
            >
            <input
              type="text"
              v-model="name"
              placeholder="홍길동"
              class="form-input"
            />
          </div>
          <div class="input-group">
            <label class="input-label"
              >비밀번호 <span class="required">*</span></label
            >
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                :placeholder="passwordPlaceholder"
                class="form-input"
              />
              <button
                type="button"
                class="toggle-pw-btn"
                @click="showPassword = !showPassword"
              >
                <i
                  :class="[
                    'fa-solid',
                    showPassword ? 'fa-eye-slash' : 'fa-eye',
                  ]"
                ></i>
              </button>
            </div>
          </div>

          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

          <button type="submit" class="submit-btn">
            {{ submitBtnText }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}
.modal-header {
  background-color: #5bbc73;
  padding: 24px 30px 24px;
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}
.close-btn:hover {
  color: white;
}

/* 토글 탭 스타일 */
.auth-tabs {
  display: flex;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 30px; /* 더 둥글게 */
  padding: 4px;
  position: relative;
}
.tab-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  bottom: 4px;
  width: calc(50% - 4px);
  background: white;
  border-radius: 26px; /* 더 둥글게 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}
.tab-slider.is-signup {
  transform: translateX(100%);
}
.tab-btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  border-radius: 26px; /* 더 둥글게 */
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  z-index: 2;
}
.tab-btn.active {
  color: #5bbc73;
}

.modal-body {
  padding: 30px;
}

.input-group {
  margin-bottom: 16px;
}
.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2f3542;
}
.input-label .required {
  color: #ff4d4d;
  margin-left: 2px;
}
.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-input:focus {
  border-color: #5bbc73;
  outline: none;
}

.password-input-wrapper {
  position: relative;
}
.password-input-wrapper .form-input {
  padding-right: 45px; /* 버튼과 글자가 겹치지 않도록 여백 추가 */
}
.toggle-pw-btn {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a4b0be;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0;
}
.toggle-pw-btn:hover {
  color: #2f3542;
}

.error-msg {
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-bottom: 16px;
  font-weight: 600;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 8px;
  background-color: #5bbc73;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}
.submit-btn:hover {
  background-color: #4aa862; /* 마우스 호버 시 약간 더 어두운 색상 */
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
