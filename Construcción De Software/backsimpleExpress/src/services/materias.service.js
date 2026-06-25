// Materias Service
class MateriasService {
  async getAllMaterias() {
    // Implementation here
    return [];
  }

  async getMateriaById(id) {
    // Implementation here
    return null;
  }

  async createMateria(materiaData) {
    // Implementation here
    return materiaData;
  }

  async updateMateria(id, materiaData) {
    // Implementation here
    return materiaData;
  }

  async deleteMateria(id) {
    // Implementation here
    return true;
  }
}

module.exports = new MateriasService();
