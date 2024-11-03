import connectDb from '../config/db.js'; // Asegúrate de importar tu conexión a la base de datos
import { ObjectId } from 'mongodb';

const db = await connectDb(); // Conectar a la base de datos

// Crear un auto
export const createCar = async (req, res) => {
    try {
        const newCar = req.body;
        const result = await db.collection('cars').insertOne(newCar);
        res.status(201).json({ success: true, message: "Auto creado con éxito.", carId: result.insertedId });
    } catch (error) {
        console.error("Error creando el auto:", error);
        res.status(500).json({ success: false, message: "Error al crear el auto." });
    }
};

// Insertar múltiples autos
export const createCarsBulk = async (req, res) => {
    try {
        const newCars = req.body;
        const result = await db.collection('cars').insertMany(newCars);
        res.status(201).json({ success: true, message: "Autos creados con éxito.", carIds: result.insertedIds });
    } catch (error) {
        console.error("Error creando múltiples autos:", error);
        res.status(500).json({ success: false, message: "Error al crear múltiples autos." });
    }
};

// Obtener todos los autos
export const getCars = async (req, res) => {
    try {
        const cars = await db.collection('cars').find().toArray();
        res.status(200).json({ success: true, cars });
    } catch (error) {
        console.error("Error obteniendo los autos:", error);
        res.status(500).json({ success: false, message: "Error al obtener los autos." });
    }
};

// Obtener un auto por ID
export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await db.collection('cars').findOne({ _id: new ObjectId(id) }); // Asegúrate de importar ObjectId

        if (!car) {
            return res.status(404).json({ success: false, message: "Auto no encontrado." });
        }

        res.status(200).json({ success: true, car });
    } catch (error) {
        console.error("Error obteniendo el auto:", error);
        res.status(500).json({ success: false, message: "Error al obtener el auto." });
    }
};

// Actualizar un auto
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCar = req.body;

        const result = await db.collection('cars').updateOne({ _id: new ObjectId(id) }, { $set: updatedCar });

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Auto no encontrado." });
        }

        res.status(200).json({ success: true, message: "Auto actualizado con éxito." });
    } catch (error) {
        console.error("Error actualizando el auto:", error);
        res.status(500).json({ success: false, message: "Error al actualizar el auto." });
    }
};

// Borrar un auto
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.collection('cars').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Auto no encontrado." });
        }

        res.status(200).json({ success: true, message: "Auto borrado con éxito." });
    } catch (error) {
        console.error("Error borrando el auto:", error);
        res.status(500).json({ success: false, message: "Error al borrar el auto." });
    }
};
