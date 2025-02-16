import jwt from "jsonwebtoken";
// generateToken function for user
export const generateToken = function (email, id) {
  try {
    const payload = { email, id };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: process.env.JWT_LIFETIME };
    return jwt.sign(payload, secret, options);
  } catch (err) {
    console.error(err);
    return null;
  }
};
