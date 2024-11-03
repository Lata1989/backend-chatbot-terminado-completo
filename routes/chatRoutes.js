import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addConversation,
  createChat,
  deleteChat,
  getAllChats,
  getConversation,
} from "../controllers/chatControllers.js";

const router = express.Router();

router.post("/new", isAuth, createChat); // Crear un nuevo chat
router.get("/all", isAuth, getAllChats); // Obtener todos los chats del usuario
router.post("/:id", isAuth, addConversation); // Agregar conversación a un chat
router.get("/:id", isAuth, getConversation); // Obtener conversaciones de un chat específico
router.delete("/:id", isAuth, deleteChat); // Eliminar un chat

export default router;
