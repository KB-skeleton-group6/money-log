import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const matchPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
