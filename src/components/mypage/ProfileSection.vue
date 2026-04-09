<script setup>
import { reactive, ref } from "vue";

const createdAt = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const user = reactive({
  name: "홍길동",
  email: "gdhong@gmail.com",
  createdAt: `${createdAt} 가입`,
  grade: "일반 회원",
});

const isEditMode = ref(false);

const changedName = ref("");

const clickEditButton = () => {
  isEditMode.value = true;
  changedName.value = user.name;
};

const inputName = (event) => {
  changedName.value = event.target.value;
};

const saveChanges = () => {
  if (changedName.value.trim() === "") {
    alert("이름을 입력해주세요.");
    return;
  }
  user.name = changedName.value;
  isEditMode.value = false;
};

const cancelChanges = () => {
  isEditMode.value = false;
};
</script>

<template>
  <div class="profile-section">
    <div class="profile-header">
      <div class="profile-image">
        <span>{{ user.name[0] }}</span>
      </div>
      <div class="profile-summary">
        <div class="name-grade">
          <span class="name">{{ user.name }}</span
          ><span class="grade">{{ user.grade }}</span>
        </div>
        <div class="email">{{ user.email }}</div>
        <div class="created-at">{{ user.createdAt }}</div>
      </div>
      <button class="edit-btn" v-if="!isEditMode" @click="clickEditButton">
        <i class="fa-solid fa-pencil"></i>
        <span>정보 수정</span>
      </button>
    </div>
    <div class="profile-detail" v-if="!isEditMode">
      <div class="profile-detail-item">
        <div class="profile-detail-item-icon">
          <i class="fa-regular fa-user"></i>
        </div>
        <div class="profile-detail-item-content">
          <div class="label">이름</div>
          <div class="value">{{ user.name }}</div>
        </div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-item-icon">
          <i class="fa-regular fa-envelope"></i>
        </div>
        <div class="profile-detail-item-content">
          <div class="label">이메일</div>
          <div class="value">{{ user.email }}</div>
        </div>
      </div>
      <div class="profile-detail-item">
        <div class="profile-detail-item-icon">
          <i class="fa-regular fa-calendar-days"></i>
        </div>
        <div class="profile-detail-item-content">
          <div class="label">가입일</div>
          <div class="value">{{ createdAt }}</div>
        </div>
      </div>
    </div>
    <div class="profile-edit" v-if="isEditMode">
      <div class="name">이름<span>*</span></div>
      <input
        class="name-input"
        type="text"
        :value="changedName"
        @input="inputName"
      />
      <div class="buttons">
        <button class="cancel-btn" @click="cancelChanges">취소</button>
        <button class="save-btn" @click="saveChanges">저장하기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

.profile-header {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  gap: 16px;
  padding: 16px;
}

.profile-image {
  flex: 0 0 auto;
  display: flex;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background-color: #00c78b;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profile-image > span {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.profile-summary {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 8px;
}

.profile-summary .name-grade {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 16px;
}

.profile-summary .name {
  flex: 0 0 auto;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.profile-summary .grade {
  flex: 0 0 auto;
  margin: 0;
  color: #00c78b;
  font-size: 12px;
  font-weight: bold;
}

.profile-summary .email {
  flex: 0 0 auto;
  margin: 0;
  font-size: 12px;
  color: rgb(153, 153, 153);
}

.profile-summary .created-at {
  flex: 0 0 auto;
  margin: 0;
  font-size: 10px;
  color: rgb(195, 195, 195);
}

.edit-btn {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
  padding: 8px;
  background: none;
  color: rgb(50, 50, 50);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn > i {
  font-size: 10px;
}

.edit-btn:hover {
  background-color: rgb(240, 240, 240);
}

.profile-detail {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 4px;
  padding: 16px;
}

.profile-detail > .profile-detail-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 16px;
  height: 60px;
}

.profile-detail-item-icon {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 4px;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.profile-detail-item-icon > i {
  font-size: 16px;
  color: #c2c2c2;
}

.profile-detail-item-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 4px;
}

.profile-detail-item-content .label {
  flex: 0 0 auto;
  margin: 0;
  font-size: 12px;
  color: #c2c2c2;
}

.profile-detail-item-content .value {
  flex: 0 0 auto;
  margin: 0;
  font-size: 14px;
}

.profile-edit {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  gap: 8px;
  padding: 16px;
  max-width: 400px;
}

.profile-edit .name {
  flex: 0 0 auto;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.profile-edit .name > span {
  color: red;
}

.profile-edit .name-input {
  flex: 0 0 auto;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 8px;
  padding: 8px;
  color: rgb(79, 79, 79);
  background-color: white;
}

.profile-edit .buttons {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 8px;
}

.profile-edit .buttons > button {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid rgb(240, 240, 240);
  border-radius: 10px;
  padding: 8px;
  color: rgb(79, 79, 79);
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.profile-edit .buttons > .save-btn {
  background-color: #00c78b;
  color: white;
}
</style>
