import connectDb from "../config/db.js"; // Conexión a la base de datos
import { ObjectId } from "mongodb"; // Para trabajar con ObjectId en MongoDB

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = {
      userId: new ObjectId(userId), // Convertir a ObjectId
      latestMessage: "Nuevo chat",
      timestamp: new Date(), // Fecha actual
    };

    const db = await connectDb();
    const result = await db.collection('chats').insertOne(chat); // Guardamos el nuevo chat

    res.json(result.ops[0]); // Retornar el chat creado
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const db = await connectDb();
    const chats = await db.collection('chats').find({ userId: req.user._id }).sort({ timestamp: -1 }).toArray(); // Obtener todos los chats del usuario

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addConversation = async (req, res) => {
  try {
    const chatId = req.params.id;
    const db = await connectDb();
    
    // Comprobar si el chat existe
    const chat = await db.collection('chats').findOne({ _id: new ObjectId(chatId) });
    if (!chat) {
      return res.status(404).json({
        message: "No hay chat con este id",
      });
    }

    const conversation = {
      chatId: new ObjectId(chatId), // Convertir a ObjectId
      question: req.body.question,
      answer: req.body.answer,
      timestamp: new Date(), // Fecha actual
    };

    await db.collection('conversations').insertOne(conversation); // Guardamos la conversación

    const updatedChat = await db.collection('chats').findOneAndUpdate(
      { _id: new ObjectId(chatId) },
      { $set: { latestMessage: req.body.question, timestamp: new Date() } },
      { returnOriginal: false }
    );

    res.json({
      conversation,
      updatedChat: updatedChat.value, // Retornar el chat actualizado
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const chatId = req.params.id;
    const db = await connectDb();
    
    const conversations = await db.collection('conversations').find({ chatId: new ObjectId(chatId) }).toArray(); // Obtener las conversaciones del chat

    if (!conversations.length) {
      return res.status(404).json({
        message: "No hay una conversacion con este id",
      });
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;
    const db = await connectDb();
    
    const chat = await db.collection('chats').findOne({ _id: new ObjectId(chatId) });
    if (!chat) {
      return res.status(404).json({
        message: "No hay chat con este ID",
      });
    }

    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Sin autorizacion",
      });
    }

    await db.collection('chats').deleteOne({ _id: new ObjectId(chatId) }); // Eliminar el chat

    res.json({
      message: "Chat borrado",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
