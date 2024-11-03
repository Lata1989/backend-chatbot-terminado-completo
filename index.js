import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ruta base
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
  });  

// Importar las rutas
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js"
import carRoutes from "./routes/carRoutes.js"

// Usar las rutas
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/gemini', geminiRoutes);
app.use('/api/car', carRoutes);

// Conectar a la base de datos y arrancar el servidor
const startServer = async () => {
  try {
    await connectDb(); // Conectar a MongoDB antes de iniciar el servidor

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Servidor funcionando en el puerto: ${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
  }
};

startServer(); // Iniciar el servidor
