// Materias Repository
class MateriasRepository {
  async findAll() {
    // Implementation here
    return [];
  }

  async findById(id) {
    // Implementation here
    return null;
  }

  async create(materiaData) {
    // Implementation here
    return materiaData;
  }

  async update(id, materiaData) {
    // Implementation here
    return materiaData;
  }

  async delete(id) {
    // Implementation here
    return true;
  }
}

module.exports = new MateriasRepository();
