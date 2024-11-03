import sendMail from "../middlewares/sendMail.js";
import connectDb from "../config/db.js"; // Conexión a la base de datos
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb"; // Para trabajar con ObjectId en MongoDB

const otpStorage = {}; // Almacenaremos el OTP en memoria temporalmente

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    const db = await connectDb();
    const usersCollection = db.collection('users'); // Accedemos a la colección de usuarios

    // Buscamos el usuario por email
    let user = await usersCollection.findOne({ email });

    // Si no existe el usuario, lo creamos
    if (!user) {
      const result = await usersCollection.insertOne({
        email,
        timestamp: new Date(),
      });
      user = result.ops[0]; // El nuevo usuario creado
    }

    const otp = Math.floor(Math.random() * 1000000); // Generamos un OTP de 6 dígitos
    otpStorage[email] = otp; // Almacenamos el OTP en memoria usando el email como clave

    // Creamos el token de verificación
    const verifyToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m", // El token expira en 5 minutos
    });

    // Enviamos el correo con el OTP
    await sendMail(email, "ChatBot", otp);

    res.json({
      message: "OTP enviado a tu correo",
      verifyToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, verifyToken } = req.body;

    // Verificamos el token con JWT
    const verify = jwt.verify(verifyToken, process.env.ACTIVATION_SECRET);

    if (!verify) {
      return res.status(400).json({
        message: "OTP expirado",
      });
    }

    // Comparamos el OTP recibido con el OTP almacenado en memoria
    if (otpStorage[verify.user.email] !== parseInt(otp, 10)) {
      return res.status(400).json({
        message: "OTP incorrecto",
      });
    }

    // Creamos el token JWT de sesión
    const token = jwt.sign({ _id: verify.user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d", // El token de sesión expira en 5 días
    });

    // Limpiamos el OTP después de la verificación
    delete otpStorage[verify.user.email];

    res.json({
      message: "Inicio de sesión exitoso",
      user: verify.user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const db = await connectDb();
    const usersCollection = db.collection('users');

    // Buscamos el usuario por su ID
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user._id) });

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
