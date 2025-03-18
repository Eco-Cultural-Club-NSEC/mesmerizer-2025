console.log("utils");
import nodemailer from "nodemailer";
import { query as db } from "./db/db.js";

import jwt from "jsonwebtoken";
import logger from "./config/logger.js";
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

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL, // Your email
//     pass: process.env.EMAIL_PASSWORD, // Your email password or app password
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  secure: process.env.EMAIL_SECURE,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 30000, // Increase timeout to 30 seconds
  tls: {
    rejectUnauthorized: false, // Helps with SSL issues
  },
});

// Function to send an email
export const sendMail = async ({ to, subject, content } = {}) => {
  try {
    if (!to || !subject || !content) {
      return false;
    }
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      // text: content, // For plain text email
      html: content, // For HTML email
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(info.response);
    return info;
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
};

export const getParticipantById = async (id = null) => {
  try {
    if (!id) {
      return null;
    }

    const res = await db("SELECT * FROM participants where id = $1", [id]);
    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0];
  } catch (error) {
    logger.error(error);
  }
};

export const getMailTemplateById = async (id = null) => {
  try {
    if (!id) {
      return null;
    }

    const res = await db("SELECT * FROM email_templates where id = $1", [id]);
    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0];
  } catch (error) {
    logger.error(error);
  }
};

export const mapEmailTemplateIdToStatus = (status = null) => {
  switch (status) {
    case "approved":
      return "approval";
    case "rejected":
      return "rejection";
    default:
      return null;
  }
};

export const constructMailBody = ({ participant, template } = {}) => {
  if (!participant || !template) {
    return null;
  }
  const mailBody = template.content
    .replace(/{{name}}/g, participant.name[0])
    .replace(/{{event}}/g, participant.event)
    .replace(/{{eventDate}}/g, participant.event_date)
    .replace(/{{eventLocation}}/g, participant.event_location);
  return mailBody;
};

export const FE_REDIRECT_URL =
  process.env.NODE_ENV === "production"
    ? "https://admin.mesmerizernsec.club"
    : "http://localhost:5173";

export const GOOGLE_CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://mesmerizer-2025-seven.vercel.app/api/v1/auth/google/callback"
    : "http://localhost:5001/api/v1/auth/google/callback";
