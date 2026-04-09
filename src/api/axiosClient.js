import axios from "axios";
import { NetworkOfflineError, ApiError } from "./networkError";
import { ApiErrorCode } from "@shared/apiErrorCodes";
import router from "@/router";

const urlPrefix = "/api";

const client = axios.create();

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth-storage");
  const auth = stored ? JSON.parse(stored) : null;
  if (auth?.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      throw new NetworkOfflineError();
    }
    const serverErrorCode = error.response.data?.errorCode;

    if (serverErrorCode === ApiErrorCode.AUTH_TOKEN_INVALID) {
      localStorage.removeItem("auth-storage");
      window.dispatchEvent(new Event("auth:session-expired"));
      router.push("/auth/login");
    }

    throw new ApiError(serverErrorCode);
  },
);

async function signup({ email, password, name }) {
  const res = await client.post(`${urlPrefix}/auth/signup`, {
    email,
    password,
    name,
  });

  return res.data;
}

async function login({ email, password }) {
  const res = await client.post(`${urlPrefix}/auth/login`, {
    email,
    password,
  });

  const authHeader = res.headers.authorization;
  return authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
}

async function resetPassword({ currentPassword, newPassword }) {
  await client.post(`${urlPrefix}/auth/reset-password`, {
    current_password: currentPassword,
    new_password: newPassword,
  });
}

async function withdraw() {
  await client.post(`${urlPrefix}/auth/withdraw`, {});
}

async function getMyProfile() {
  const res = await client.get(`${urlPrefix}/profiles/me`);

  return res.data;
}

async function getProfile({ memberId }) {
  const res = await client.get(`${urlPrefix}/members/${memberId}`);

  return res.data;
}

async function updateProfile({ memberId, name }) {
  await client.put(`${urlPrefix}/members/${memberId}`, { name });
}

async function getMembers() {
  const res = await client.get(`${urlPrefix}/members`);

  return res.data;
}

async function getMember(memberId) {
  const res = await client.get(`${urlPrefix}/members/${memberId}`);

  return res.data;
}

async function getMemberByEmail(email) {
  const res = await client.get(`${urlPrefix}/members?email:eq=${email}`);

  return res.data;
}

async function createMember(member) {
  const res = await client.post(`${urlPrefix}/members`, member);

  return res.data;
}

async function updateMember(memberId, member) {
  const res = await client.put(`${urlPrefix}/members/${memberId}`, member);

  return res.data;
}

async function deleteMember(memberId) {
  await client.delete(`${urlPrefix}/members/${memberId}`);
}

async function getTransactions() {
  const res = await client.get(`${urlPrefix}/transactions`);

  return res.data;
}

async function getTransaction(transactionId) {
  const res = await client.get(`${urlPrefix}/transactions/${transactionId}`);

  return res.data;
}

async function createTransaction(transaction) {
  const res = await client.post(`${urlPrefix}/transactions`, transaction);

  return res.data;
}

async function updateTransaction(transactionId, transaction) {
  const res = await client.put(
    `${urlPrefix}/transactions/${transactionId}`,
    transaction,
  );

  return res.data;
}

async function deleteTransaction(transactionId) {
  await client.delete(`${urlPrefix}/transactions/${transactionId}`);
}

const authApi = {
  signup,
  login,
  resetPassword,
  withdraw,
};

const profileApi = {
  getMyProfile,
  getProfile,
  updateProfile,
};

const memberApi = {
  getMembers,
  getMember,
  getMemberByEmail,
  createMember,
  updateMember,
  deleteMember,
};

const transactionApi = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

export default { authApi, profileApi, memberApi, transactionApi };
