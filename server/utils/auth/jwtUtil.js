import jwt from "jsonwebtoken";

const jwtSecret = "secret";

export const issueToken = ({ id, email, name }) => {
  return jwt.sign({ sub: id, email, name }, jwtSecret, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token) => {
  const payload = jwt.verify(token, jwtSecret);
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
};
