import axios from "axios";
import {
  FetchFailedError,
  NetworkOfflineError,
  SaveFailedError,
} from "./networkError";
import { ErrorCode } from "@/constant/errorCode";

const urlPrefix = "/api";

const isRequestSuccessful = (statusCode) => {
  return statusCode >= 200 && statusCode < 300;
};

const onFetchFailed = () => {
  throw new FetchFailedError();
};

const onSaveFailed = () => {
  throw new SaveFailedError();
};

const onNetworkOffline = () => {
  throw new NetworkOfflineError();
};

const checkRequestFailed = (statusCode, errorCode) => {
  if (!isRequestSuccessful(statusCode)) {
    switch (errorCode.code) {
      case ErrorCode.FETCH_FAILED.code:
        onFetchFailed();
        break;
      case ErrorCode.SAVE_FAILED.code:
        onSaveFailed();
        break;
      default:
        onNetworkOffline();
    }
  }
};

async function getMembers() {
  const res = await axios.get(`${urlPrefix}/members`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getMember(memberId) {
  const res = await axios.get(`${urlPrefix}/members/${memberId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getMemberByEmail(email) {
  const res = await axios.get(`${urlPrefix}/members?email:eq=${email}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function createMember(member) {
  const res = await axios.post(`${urlPrefix}/members`, member);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function updateMember(memberId, member) {
  const res = await axios.put(`${urlPrefix}/members/${memberId}`, member);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function deleteMember(memberId) {
  const res = await axios.delete(`${urlPrefix}/members/${memberId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);
}

async function getTransactions() {
  const res = await axios.get(`${urlPrefix}/transactions`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getTransaction(transactionId) {
  const res = await axios.get(`${urlPrefix}/transactions/${transactionId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getTransactionsByUserId(userId) {
  const res = await axios.get(`${urlPrefix}/transactions`, {
    params: { user_id: userId },
  });

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function createTransaction(transaction) {
  const res = await axios.post(`${urlPrefix}/transactions`, transaction);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function updateTransaction(transactionId, transaction) {
  const res = await axios.put(
    `${urlPrefix}/transactions/${transactionId}`,
    transaction,
  );

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function deleteTransaction(transactionId) {
  const res = await axios.delete(`${urlPrefix}/transactions/${transactionId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);
}

async function getCategories() {
  const res = await axios.get(`${urlPrefix}/categories`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getPayments() {
  const res = await axios.get(`${urlPrefix}/payments`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function getBudgets(userId) {
  const res = await axios.get(`${urlPrefix}/budgets`, {
    params: { user_id: userId },
  });

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  return res.data;
}

async function createBudget(budget) {
  const res = await axios.post(`${urlPrefix}/budgets`, budget);

  checkRequestFailed(res.status, ErrorCode.SAVE_FAILED);

  return res.data;
}

async function updateBudget(id, budget) {
  const res = await axios.put(`${urlPrefix}/budgets/${id}`, budget);

  checkRequestFailed(res.status, ErrorCode.SAVE_FAILED);

  return res.data;
}

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
  getTransactionsByUserId,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

const categoryApi = {
  getCategories,
};

const paymentApi = {
  getPayments,
};

const budgetApi = {
  getBudgets,
  createBudget,
  updateBudget,
};

export default { memberApi, transactionApi, categoryApi, paymentApi, budgetApi };
