// Materias Routes
const express = require('express');
const materiasController = require('../controllers/materias.controller');

const router = express.Router();

router.get('/', materiasController.getMaterias);
router.get('/:id', materiasController.getMateriaById);
router.post('/', materiasController.createMateria);

module.exports = router;
