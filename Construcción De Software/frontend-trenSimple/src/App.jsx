import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://backtrensupersimple.vercel.app';

function App() {
  const [materias, setMaterias] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // NUEVO: Estado para usuarios
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('profe@epet12smandes.edu.ar');
  const [password, setPassword] = useState('supersecreta123');
  
  const [nuevaMateria, setNuevaMateria] = useState({ name: '', description: '', professor_id: 1 });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  // NUEVO: Estado para inscripciones
  const [inscripcion, setInscripcion] = useState({ student_id: '', subject_id: '' });

  const fetchMaterias = () => {
    setLoading(true);
    axios.get(`${API_URL}/materias`)
      .then(response => {
        setMaterias(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error al traer materias:", error);
        setLoading(false);
      });
  };

  // NUEVO: Función para traer usuarios (requiere token)
  const fetchUsuarios = () => {
    if (!token) return;
    axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Filtramos para mostrar solo los estudiantes, si querés
        const estudiantes = response.data.filter(u => u.role === 'STUDENT');
        setUsuarios(estudiantes.length > 0 ? estudiantes : response.data);
      })
      .catch(error => console.error("Error al traer usuarios:", error));
  };

  // Traer materias siempre al inicio
  useEffect(() => {
    fetchMaterias();
  }, []);

  // Traer usuarios cada vez que el token cambie (cuando nos logueamos)
  useEffect(() => {
    if (token) {
      fetchUsuarios();
    } else {
      setUsuarios([]); // Limpiar si cerramos sesión
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const tokenRecibido = response.data.token; 
      setToken(tokenRecibido);
      localStorage.setItem('token', tokenRecibido); 
    } catch (error) {
      alert("Error al iniciar sesión. Revisá las credenciales.");
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const handleCrearMateria = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/materias`, nuevaMateria, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNuevaMateria({ name: '', description: '', professor_id: 1 });
      fetchMaterias(); 
    } catch (error) {
      alert("Error al crear la materia.");
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés borrar esta materia?");
    if (!confirmar) return;
    try {
      await axios.delete(`${API_URL}/materias/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterias(); 
    } catch (error) {
      alert("Error al eliminar la materia.");
    }
  };

  const handleActualizar = async (id) => {
    try {
      await axios.put(`${API_URL}/materias/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchMaterias();
    } catch (error) {
      alert("Error al actualizar la materia.");
    }
  };

  // NUEVO: Función para inscribir alumno
  const handleInscribir = async (e) => {
    e.preventDefault();
    if (!inscripcion.student_id || !inscripcion.subject_id) {
      alert("Por favor, seleccioná un alumno y una materia.");
      return;
    }
    try {
      await axios.post(`${API_URL}/relaciones/cursa`, {
        student_id: parseInt(inscripcion.student_id),
        subject_id: parseInt(inscripcion.subject_id)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("¡Alumno inscripto correctamente!");
      setInscripcion({ student_id: '', subject_id: '' });
    } catch (error) {
      alert("Error al inscribir. ¿Quizás ya está inscripto en esta materia?");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center' }}>🚂 Panel de Backtren</h1>
      
      {/* HEADER DE AUTENTICACIÓN */}
      <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #333' }}>
        {!token ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
            <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Iniciar Sesión</button>
          </form>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ Conectado como Profesor</span>
            <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cerrar Sesión</button>
          </div>
        )}
      </div>

      {token && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          {/* CREAR MATERIA */}
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3>Agregar Materia</h3>
            <form onSubmit={handleCrearMateria} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Nombre" value={nuevaMateria.name} onChange={(e) => setNuevaMateria({...nuevaMateria, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
              <input type="text" placeholder="Descripción" value={nuevaMateria.description} onChange={(e) => setNuevaMateria({...nuevaMateria, description: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Crear</button>
            </form>
          </div>

          {/* INSCRIBIR ALUMNO */}
          <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3>Inscribir Alumno</h3>
            <form onSubmit={handleInscribir} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <select value={inscripcion.student_id} onChange={(e) => setInscripcion({...inscripcion, student_id: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }}>
                <option value="">-- Seleccionar Alumno --</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>

              <select value={inscripcion.subject_id} onChange={(e) => setInscripcion({...inscripcion, subject_id: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }}>
                <option value="">-- Seleccionar Materia --</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <button type="submit" style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Inscribir</button>
            </form>
          </div>

        </div>
      )}

      <h2>Lista de Materias</h2>
      <hr style={{ borderColor: '#333' }} />

      {loading ? (
        <p>Cargando información desde el servidor...</p>
      ) : materias.length === 0 ? (
        <p>No hay materias cargadas en la base de datos todavía.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {materias.map((materia) => (
            <li key={materia.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #333', backgroundColor: '#1e1e1e', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
              {editingId === materia.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginRight: '15px' }}>
                  <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
                  <input type="text" value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: '#fff' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleActualizar(materia.id)} style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                    <button onClick={() => setEditingId(null)} style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{materia.name}</h3>
                    <p style={{ margin: 0, color: '#aaa' }}>{materia.description}</p>
                  </div>
                  {token && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { setEditingId(materia.id); setEditData({ name: materia.name, description: materia.description }); }} style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                      <button onClick={() => handleEliminar(materia.id)} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;