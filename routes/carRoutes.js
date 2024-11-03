import express from 'express';
import { 
    createCar, 
    createCarsBulk, 
    getCars, 
    getCarById, 
    updateCar, 
    deleteCar 
} from '../controllers/carController.js';

const router = express.Router();

// Rutas para el CRUD de autos
router.post('/', createCar);             // Insertar un auto
router.post('/bulk', createCarsBulk);    // Insertar muchos autos
router.get('/', getCars);                 // Obtener todos los autos
router.get('/:id', getCarById);           // Obtener un auto por ID
router.put('/:id', updateCar);            // Actualizar un auto
router.delete('/:id', deleteCar);         // Borrar un auto

export default router;
