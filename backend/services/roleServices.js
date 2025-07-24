import { pool, io } from "../server.js";

const getAllowedRegistrationRoles = async () => {
  const allowedRoles = ["Water", "CCMS", "User"];
  const [results] = await pool.execute(
    `SELECT id, name,permission FROM roles WHERE name IN (?, ?, ,? ?)`,
    allowedRoles
  );
  return results;
};

export default getAllowedRegistrationRoles;
