import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axiosClient from "@/api/axiosClient";
import { ErrorCode } from "@/constant/errorCode";
import { MemberInfoError } from "@/utils/validators/authValidator";

const getProfileFromUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
  };
};

export const useAuthStore = defineStore("auth", () => {
  const AUTH_STORAGE_KEY = "auth-storage";

  const loadLocalUser = () => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const saveLocalUser = (user) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const removeLocalUser = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const user = ref(loadLocalUser());
  const isLoggedIn = computed(() => !!user.value);

  const updateUser = (newUser) => {
    user.value = newUser;
    saveLocalUser(newUser);
  };

  /**
   * 사용자 로그인 처리
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<void>}
   */
  const login = async (email, password) => {
    try {
      // 서버(json-server)에 이메일과 비밀번호가 일치하는 데이터만 요청
      const members = await axiosClient.memberApi.getMemberByEmail(email);

      const foundUser = members.length > 0 ? members[0] : null;

      if (foundUser) {
        if (foundUser.password !== password) {
          throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
        }

        // 비밀번호를 제외한 정보만 저장
        updateUser(getProfileFromUser(foundUser));
        console.log("로그인 성공:", user.value);
      } else {
        user.value = null;
        throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
      }
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      console.error("로그인 API 에러:", error);
      throw new MemberInfoError(ErrorCode.FETCH_FAILED);
    }
  };

  /**
   * 사용자 회원가입 처리
   * @param {string} email
   * @param {string} password
   * @param {string} name
   */
  const signup = async (email, password, name) => {
    try {
      const members = await axiosClient.memberApi.getMemberByEmail(email);
      if (members.length > 0) {
        throw new MemberInfoError(ErrorCode.DUPLICATE_EMAIL);
      }

      // 2. 회원가입 (POST 요청으로 db.json에 데이터 추가)
      const newUser = {
        email,
        password,
        name,
        created_at: new Date().toISOString(),
      };

      await axiosClient.memberApi.createMember(newUser);

      console.log("회원가입 성공");
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      console.error("회원가입 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const logout = () => {
    user.value = null;
    removeLocalUser();
    console.log("로그아웃 성공");
  };

  const withdraw = async () => {
    try {
      await axiosClient.memberApi.deleteMember(user.value.id);
      logout();
      console.log("회원탈퇴 성공");
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      console.error("회원가입 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const updateProfile = async ({ name }) => {
    try {
      const members = await axiosClient.memberApi.getMemberByEmail(
        user.value.email,
      );
      const foundUser = members.length > 0 ? members[0] : null;

      if (!foundUser) {
        throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
      }
      const updatedUser = { ...foundUser, name };
      await axiosClient.memberApi.updateMember(foundUser.id, updatedUser);
      updateUser(getProfileFromUser(updatedUser));
      console.log("프로필 업데이트 성공");
    } catch (error) {
      console.error("프로필 업데이트 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const members = await axiosClient.memberApi.getMemberByEmail(
        user.value.email,
      );
      const foundUser = members.length > 0 ? members[0] : null;

      if (!foundUser) {
        throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
      }

      if (currentPassword !== foundUser.password) {
        throw new MemberInfoError(ErrorCode.PASSWORD_MISMATCH);
      }

      const updatedUser = { ...user.value, password: newPassword };

      await axiosClient.memberApi.updateMember(user.value.id, updatedUser);

      console.log("비밀번호 변경 성공");
    } catch (error) {
      console.error("비밀번호 변경 에러", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  return {
    isLoggedIn,
    user,
    login,
    signup,
    logout,
    withdraw,
    updateProfile,
    changePassword,
  };
});
