const UserRepository = require('../repositories/userRepository');
const CartRepository = require('../repositories/cartRepository');
const utils = require("../utils")
const nodemailer = require("nodemailer")

// Instanciando clases
const userRepository = new UserRepository();
const cartRepository = new CartRepository()

// Función para obtener todos los usuarios
async function getAllUsers() {
  return userRepository.getAllUsers();
}

// Función para obtener un usuario por correo electrónico
async function getUserByEmail(userEmail) {
  return userRepository.getUserByEmail(userEmail);
}

async function getUserById(userId) {
  return userRepository.getUserById(userId);
}

// Función para crear un nuevo usuario
async function createUser({ first_name, last_name, email, age, password, rol }) {
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: utils.createHash(password),
    rol,
  };

  return userRepository.createUser(newUser);
}

// Función para actualizar un usuario
async function updateUser(userEmail, userData) {
  if (userData.email) {
    throw new Error("No se puede modificar el correo electrónico");
  }

  return userRepository.updateUser(userEmail, userData);
}

// Función para eliminar un usuario
async function deleteUser(userEmail) {
  return userRepository.deleteUser(userEmail);
}

async function updatePassword(userId, newPassword) {
  try { 
    const updatedUser = await userRepository.updatePassword(userId, newPassword);
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function toggleUserRole(userId) {
  try {
    const updatedUser = await userRepository.toggleUserRole(userId);
    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function uploadDocuments(userId, documents){
  try {
    const uploadDocuments = await userRepository.updateDocuments(userId, documents);
    return uploadDocuments;
  } catch (error) {
    throw new Error(`Error al tratar de subir la referencia del documento al usuario ${error.message}`);
  }
}

async function getUsersInactiveForDays(days) {
  try {
    const inactiveUsers = await userRepository.getUsersInactiveForDays(days);
    return inactiveUsers;
  } catch (error) {
    throw error;
  }
}

async function deleteInactiveUsers(userIds) {
  try {
    const deletedUsers = await userRepository.getUsersByIds(userIds);

    // Elimina usuarios inactivos de la base de datos
    await userRepository.deleteInactiveUsers(userIds);

    // Envía correos electrónicos a usuarios eliminados
    await sendDeletionEmails(deletedUsers);

    return deletedUsers;
  } catch (error) {
    throw error;
  }
}

async function sendDeletionEmails(users) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",  
      auth: {
          user: process.env.USER, 
          pass: process.env.PASS 
      }
    });
    for (const user of users) {
      const mailOptions = {
        from: `${process.env.GMAIL_USER}`,
        to: user.email,
        subject: 'Eliminación de cuenta por inactividad',
        text: `Hola ${user.first_name}, lamentamos informarte que tu cuenta ha sido eliminada debido a la inactividad. Si deseas volver a utilizar nuestros servicios, por favor, regístrate nuevamente.`,
      };

      // Envía el correo electrónico
      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  updatePassword,
  toggleUserRole,
  uploadDocuments,
  getUsersInactiveForDays,
  deleteInactiveUsers
};
