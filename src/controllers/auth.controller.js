console.log("auth.controller");

import dotenv from "dotenv";
dotenv.config();

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const GOOGLE_TOKEN_INFO_URL = process.env.GOOGLE_TOKEN_INFO_URL;
const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",

  "https%3A//www.googleapis.com/auth/userinfo.profile",
];

import { query as db } from "../db/db.js";
import logger from "../config/logger.js";
import { FE_REDIRECT_URL, generateToken } from "../utils.js";

export const authController = {
  // google oauth consent screen redirect handler
  googleAuth: async (req, res) => {
    try {
      const state = req.query.state || "default_state";
      const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
      const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&prompt=consent&response_type=code&state=${state}&scope=${scopes}`;
      logger.info("Redirecting to google consent screen");
      // res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
      res.status(200).json({ url: GOOGLE_OAUTH_CONSENT_SCREEN_URL });
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // callback handler for google oauth
  googleAuthCallback: async (req, res) => {
    try {
      const { code } = req.query;

      const data = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      };

      const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to fetch access token");

      const access_token_data = await response.json();
      const { id_token } = access_token_data;

      if (!id_token) throw new Error("ID token missing");

      const token_info_response = await fetch(
        `${GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
      );

      if (!token_info_response.ok) throw new Error("Invalid ID token");

      const token_info = await token_info_response.json();
      const { email, name } = token_info;

      let user = await db(`SELECT * FROM users WHERE email = $1`, [email]);

      if (user.rows.length === 0) {
        user = await db(
          `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
          [name, email]
        );
      }

      user = user.rows[0];

      const token = generateToken(user.email, user.id);

      if (!token) throw new Error("Failed to generate jwt token!");

      // set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      res.redirect(`${FE_REDIRECT_URL}/sucess`);
      // res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      logger.error("OAuth Error:", error);
      // res.status(500).json({ error: error.message });
      res.redirect(`${FE_REDIRECT_URL}/login`);
    }
  },
  // logout the user
  logout: async (req, res) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout Error:", error);
      res.status(500).json({ error: error.message });
    }
  },
  // get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = req.user;

      //db query to get user details
      let currectUser = await db("SELECT * FROM users WHERE id = $1", [
        user.id,
      ]);
      currectUser = currectUser.rows[0];
      logger.info(`Fetched current user: ${currectUser}`);
      res.status(200).json({ user: currectUser });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
