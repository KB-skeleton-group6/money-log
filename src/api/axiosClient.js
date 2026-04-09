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

  const members = res.data;

  return members;
}

async function getMember(memberId) {
  const res = await axios.get(`${urlPrefix}/members/${memberId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  const member = res.data;

  return member;
}

async function createMember(member) {
  const res = await axios.post(`${urlPrefix}/members`, member);

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);

  const createdMember = res.data;

  return createdMember;
}

async function updateMember(memberId, member) {
  const res = await axios.put(`${urlPrefix}/members/${memberId}`, member);

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);

  const updatedMember = res.data;

  return updatedMember;
}

async function deleteMember(memberId) {
  const res = await axios.delete(`${urlPrefix}/members/${memberId}`);

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);
}

async function getTransactions() {
  const res = await axios.get(`${urlPrefix}/transactions`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  const transactions = res.data;

  return transactions;
}

async function getTransaction(transactionId) {
  const res = await axios.get(`${urlPrefix}/transactions/${transactionId}`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  const transaction = res.data;

  return transaction;
}

async function createTransaction(transaction) {
  const res = await axios.post(`${urlPrefix}/transactions`, transaction);

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);

  const createdTransaction = res.data;

  return createdTransaction;
}

async function updateTransaction(transactionId, transaction) {
  const res = await axios.put(
    `${urlPrefix}/transactions/${transactionId}`,
    transaction,
  );

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);

  const updatedTransaction = res.data;

  return updatedTransaction;
}

async function deleteTransaction(transactionId) {
  const res = await axios.delete(`${urlPrefix}/transactions/${transactionId}`);

  checkFetchFailed(res.status, ErrorCode.SAVE_FAILED);
}

async function getCategories() {
  const res = await axios.get(`${urlPrefix}/categories`);

  checkRequestFailed(res.status, ErrorCode.FETCH_FAILED);

  const categories = res.data;

  return categories;
}

const memberApi = {
  getMembers,
  getMember,
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

const categoryApi = {
  getCategories,
};

export default { memberApi, transactionApi, categoryApi };
