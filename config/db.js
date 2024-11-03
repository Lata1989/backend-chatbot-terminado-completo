import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();  // Cargar las variables del archivo .env

const uri = process.env.MONGODB_URI;  // URI de conexión de MongoDB

let db;  // Variable para almacenar la conexión a la base de datos

const connectDb = async () => {
  if (db) return db;  // Si ya está conectada, la reutilizamos

  try {
    const client = new MongoClient(uri);
    await client.connect();

    db = client.db('ChatBot'); // Nombre de la base de datos
    console.log('Conectado a MongoDB');

    return db;  // Devolvemos la conexión para que pueda ser usada en otras partes de la app
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
};

export default connectDb;
