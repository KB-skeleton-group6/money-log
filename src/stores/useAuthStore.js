import { defineStore } from 'pinia';
import { ref } from 'vue';
import axiosClient from '@/api/axiosClient';
import { ErrorCode } from '@/constant/errorCode';
import { MemberInfoError } from '@/utils/validators/authValidator';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const user = ref(null);

  /**
   * 사용자 로그인 처리
   * @param {string} email - 사용자 이메일
   * @param {string} password - 사용자 비밀번호
   * @returns {Promise<void>}
   */
  const login = async (email, password) => {
    try {
      // 서버(json-server)에 이메일과 비밀번호가 일치하는 데이터만 요청
      const members = await axiosClient.memberApi.getMembers({
        email,
        password,
      });
      const foundUser = members.length > 0 ? members[0] : null;

      if (foundUser) {
        isLoggedIn.value = true;
        // 비밀번호를 제외한 정보만 저장
        user.value = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
        };
        console.log('로그인 성공:', user.value);
      } else {
        isLoggedIn.value = false;
        user.value = null;
        throw new MemberInfoError(ErrorCode.LOGIN_FAILED);
      }
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      console.error('로그인 API 에러:', error);
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
      const members = await axiosClient.memberApi.getMembers({ email });
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

      console.log('회원가입 성공');
    } catch (error) {
      if (error instanceof MemberInfoError) throw error;
      console.error('회원가입 API 에러:', error);
      throw new MemberInfoError(ErrorCode.SAVE_FAILED);
    }
  };

  const logout = () => {
    isLoggedIn.value = false;
    user.value = null;
  };

  return { isLoggedIn, user, login, signup, logout };
});
