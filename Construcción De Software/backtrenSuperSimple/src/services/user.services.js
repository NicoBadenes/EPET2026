import { pool } from "../database.js";

// OBTENER TODOS (Solo los que no están borrados)
export const getAllUsersService = async () => {
  const query = "SELECT id, name, email, role, created_at FROM users WHERE deleted_at IS NULL";
  const { rows } = await pool.query(query);
  return rows;
};

// OBTENER POR ID
export const getUserByIdService = async (id) => {
  const query = "SELECT id, name, email, role, created_at FROM users WHERE id = $1 AND deleted_at IS NULL";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// CREAR USUARIO
export const createUserService = async (name, email, password_hash, role) => {
  const query = `
    INSERT INTO users (name, email, password_hash, role) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, name, email, role
  `;
  const { rows } = await pool.query(query, [name, email, password_hash, role]);
  return rows[0];
};

// ACTUALIZAR USUARIO
export const updateUserService = async (id, name, email, role) => {
  const query = `
    UPDATE users 
    SET name = COALESCE($1, name), 
        email = COALESCE($2, email), 
        role = COALESCE($3, role)
    WHERE id = $4 AND deleted_at IS NULL
    RETURNING id, name, email, role
  `;
  const { rows } = await pool.query(query, [name, email, role, id]);
  return rows[0];
};

// BORRADO LÓGICO (Soft Delete)
export const deleteUserService = async (id) => {
  const query = `
    UPDATE users 
    SET deleted_at = NOW() 
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id, name, email, deleted_at
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};