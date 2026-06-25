// Routes Index
const express = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const materiasRoutes = require('./materias.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/materias', materiasRoutes);

module.exports = router;
