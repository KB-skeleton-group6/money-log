import { defineStore } from "pinia";
import { computed, ref } from "vue";
import axiosClient from "@/api/axiosClient";
import { ApiError } from "@/api/networkError";
import { ErrorCode } from "@/constant/errorCode";
import { MemberInfoError } from "@/utils/validators/authValidator";
import { resolveApiError } from "@/libs/apiErrorResolver";

export const useAuthStore = defineStore("auth", () => {
  const AUTH_STORAGE_KEY = "auth-storage";

  const loadLocalAuth = () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  };

  const saveLocalAuth = () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: user.value, accessToken: accessToken.value }),
    );
  };

  const removeLocalAuth = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const storedAuth = loadLocalAuth();
  const user = ref(storedAuth?.user ?? null);
  const accessToken = ref(storedAuth?.accessToken ?? null);
  const isLoggedIn = computed(() => !!user.value);

  // 인터셉터가 토큰 만료를 감지하면 인메모리 상태도 초기화
  window.addEventListener("auth:session-expired", () => {
    user.value = null;
    accessToken.value = null;
  });

  const login = async (email, password) => {
    try {
      const token = await axiosClient.authApi.login({ email, password });

      // 인터셉터가 localStorage에서 토큰을 읽으므로, getMyProfile 전에 먼저 저장
      accessToken.value = token;
      saveLocalAuth();

      const profile = await axiosClient.profileApi.getMyProfile();

      user.value = profile;
      saveLocalAuth();
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      if (error instanceof ApiError)
        throw new MemberInfoError(resolveApiError(error.serverErrorCode));
      console.error("로그인 API 에러:", error);
      throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
    }
  };

  const signup = async (email, password, name) => {
    try {
      await axiosClient.authApi.signup({ email, password, name });
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      if (error instanceof ApiError)
        throw new MemberInfoError(resolveApiError(error.serverErrorCode));
      console.error("회원가입 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const logout = () => {
    user.value = null;
    accessToken.value = null;
    removeLocalAuth();
    console.log("로그아웃 성공");
  };

  const withdraw = async () => {
    try {
      await axiosClient.authApi.withdraw();
      logout();
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      if (error instanceof ApiError)
        throw new MemberInfoError(resolveApiError(error.serverErrorCode));
      console.error("회원탈퇴 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const updateProfile = async ({ name }) => {
    try {
      await axiosClient.profileApi.updateProfile({
        memberId: user.value.id,
        name,
      });
      user.value = { ...user.value, name };
      saveLocalAuth();
    } catch (error) {
      if (error instanceof ApiError)
        throw new MemberInfoError(resolveApiError(error.serverErrorCode));
      console.error("프로필 업데이트 API 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      await axiosClient.authApi.resetPassword({ currentPassword, newPassword });
    } catch (error) {
      if (error instanceof ApiError)
        throw new MemberInfoError(resolveApiError(error.serverErrorCode));
      console.error("비밀번호 변경 에러:", error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  return {
    isLoggedIn,
    user,
    accessToken,
    login,
    signup,
    logout,
    withdraw,
    updateProfile,
    changePassword,
  };
});
