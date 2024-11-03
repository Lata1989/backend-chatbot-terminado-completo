import jwt from "jsonwebtoken";
import connectDb from "../config/db.js"; // Importamos la conexión a la base de datos
import { ObjectId } from "mongodb"; // Importamos ObjectId para la búsqueda

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']; // Obtenemos el encabezado de autorización

    if (!authHeader) {
      return res.status(403).json({ message: "No token provided, logeate" });
    }

    const token = authHeader.split(' ')[1]; // Extraemos el token del encabezado

    if (!token) {
      return res.status(403).json({ message: "No token provided, logeate" });
    }

    // Verificamos el token usando JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Conectamos a la base de datos y buscamos al usuario
    const db = await connectDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded._id) });

    if (!user) {
      return res.status(401).json({ message: "Token inválido, no encontrado" });
    }

    req.user = user;  // Añadimos el usuario al request
    next();  // Pasamos al siguiente middleware o ruta
  } catch (error) {
    res.status(500).json({ message: "Error de autenticación, primero logeate." });
  }
};
