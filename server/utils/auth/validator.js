import {
  InvalidEmailException,
  InvalidPasswordException,
  InvalidNameException,
} from "../../exceptions.js";

const nameRegex = /^[가-힣a-zA-Z\s]+$/; // 한글, 영문, 공백만
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식
const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,20}$/;

export const isNameValid = (name) => {
  if (!nameRegex.test(name)) {
    throw new InvalidNameException();
  }
};

export const isEmailValid = (email) => {
  if (!emailRegex.test(email)) {
    throw new InvalidEmailException();
  }
};

export const isPasswordValid = (password) => {
  if (!passwordRegex.test(password)) {
    throw new InvalidPasswordException();
  }
};
