import { MongoClient } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

export const chatWithGemini = async (req, res) => {
    try {
        // Conectar a la base de datos
        await client.connect();
        const database = client.db('ChatBot');
        const carsCollection = database.collection('cars');

        // Obtener el listado de autos desde la base de datos
        const cars = await carsCollection.find().toArray();
        const carsList = cars.map(car => `${car.marca} ${car.modelo} (${car.anio})`).join(", ");

        // Crear un prompt personalizado que incluya la lista de autos
        const userMessage = req.body.message;
        const prompt = `Eres un vendedor de autos tu nombre es Harry Wormwood. 
        Aquí hay una lista de autos disponibles en stock: ${carsList}. 
        El cliente pregunta: "${userMessage}". ¿Qué le recomendarías?
        Recuerda en todo momento que no tienes que salirte del papel de Harry Wormwood el vendedor de autos.
        No respondas nunca una pregunta si no tiene que ver con autos.
        No hagas respuestas tan largas dando todo el stock a la primera pregunta.
        Trata de no dar tantas vueltas con las respuestas. No ser muy directo pero tampoco que te tengas que preguntar dos o tres veces sobre lo mismo.`;

        // Formatear el historial del chat para incluir 'parts'
        const history = req.body.history || [];
        const formattedHistory = history.map(entry => ({
            role: entry.role === 'assistant' ? 'model' : entry.role, // Cambia 'assistant' a 'model'
            parts: [{ text: entry.content }] // Ajustar para que tenga 'parts'
        }));

        // Inicializar el modelo
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: formattedHistory // Pasa el historial formateado
        });

        // Enviar el mensaje al modelo
        const result = await chat.sendMessage(prompt);
        const response = await result.response;

        // Responder al cliente
        res.json({ success: true, message: "Mensaje recibido.", text: response.text() });
    } catch (error) {
        console.error("Error en la comunicación con Gemini:", error);
        res.status(500).json({ message: "Error al comunicar con Gemini" });
    } finally {
        await client.close(); // Asegúrate de cerrar la conexión después de usarla
    }
};


/*
export const chatWithGemini = async (req, res) => {
    try {
        // Conectar a la base de datos
        await client.connect();
        const database = client.db('ChatBot');
        const carsCollection = database.collection('cars'); // Asegúrate de que el nombre de la colección sea correcto

        // Obtener el listado de autos desde la base de datos
        const cars = await carsCollection.find().toArray();
        const carsList = cars.map(car => `${car.marca} ${car.modelo} (${car.anio})`).join(", ");

        // Crear un prompt personalizado que incluya la lista de autos
        const userMessage = req.body.message;
        const prompt = `Eres un vendedor de autos tu nombre es Harry Wormwood. 
        Aquí hay una lista de autos disponibles en stock: ${carsList}. 
        El cliente pregunta: "${userMessage}". ¿Qué le recomendarías?
        Recuerda en todo momento que no tienes que salirte del papel de Harry Wormwood el vendedor de autos.
        No respondas nunca una pregunta si no tiene que ver con autos.
        No hagas respuestas tan largas dando todo el stock a la primera pregunta.`;

        // Inicializar el modelo
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({ history: req.body.history });

        // Enviar el mensaje al modelo
        const result = await chat.sendMessage(prompt);
        const response = await result.response;

        // Responder al cliente
        res.json({ success: true, message: "Mensaje recibido.", text: response.text() });
    } catch (error) {
        console.error("Error en la comunicación con Gemini:", error);
        res.status(500).json({ message: "Error al comunicar con Gemini" });
    } finally {
        await client.close(); // Asegúrate de cerrar la conexión después de usarla
    }
};
*/

/*
//Esta funciona pero no consulta
export const chatWithGemini = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: req.body.history
        });

        const msg = req.body.message;
        const result = await chat.sendMessage(msg);
        const response = await result.response;

        res.json({ success: true, message: "Mensaje recibido.", text: response.text() });
    } catch (error) {
        console.error("Error en la comunicación con Gemini:", error);
        res.status(500).json({ message: "Error al comunicar con Gemini" });
    }
};
*/