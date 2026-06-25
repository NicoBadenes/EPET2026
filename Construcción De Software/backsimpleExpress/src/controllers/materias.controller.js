// Materias Controller
class MateriasController {
  async getMaterias(req, res) {
    try {
      // Implementation here
      res.json({ message: 'Get materias' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMateriaById(req, res) {
    try {
      // Implementation here
      res.json({ message: 'Get materia by ID' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMateria(req, res) {
    try {
      // Implementation here
      res.json({ message: 'Materia created' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MateriasController();
