import { query as db } from "../db/db.js";
import logger from "../config/logger.js";

export const userController = {
  // get all users
  getUsers: async (req, res) => {
    try {
      const users = await db("SELECT * FROM users");
      logger.info("Fetched all users");
      res.status(200).json({ users: users.rows });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // get current user
  getCurrentUser: async (req, res) => {
    try {
      const user = req.user;
      
      //db query to get user details
      let currectUser = await db("SELECT * FROM users WHERE id = $1", [user.id]);  
      currectUser = currectUser.rows[0];    
      logger.info(`Fetched current user: ${currectUser}`);
      res.status(200).json({ user: currectUser });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
