import * as userService from "../services/user.services.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserByIdService(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password_hash, role } = req.body;
    // Nota: Más adelante, aquí deberías encriptar el password con bcrypt antes de enviarlo al servicio
    const newUser = await userService.createUserService(name, email, password_hash, role || 'STUDENT');
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error al crear usuario", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updatedUser = await userService.updateUserService(req.params.id, name, email, role);
    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado o ya eliminado" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar usuario", details: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserService(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "Usuario no encontrado o ya eliminado" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario", details: error.message });
  }
};