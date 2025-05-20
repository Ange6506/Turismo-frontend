import { useState, useEffect } from 'react';
import Header from '../Header/Header_Turismo';
import Footer from '../Footer/Footer';
import './Admin.css';

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [permiso, setPermiso] = useState('');

const API_URL = import.meta.env.VITE_API_URL;

  // 🚀 Obtener usuarios y roles desde el backend
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/getAllUsers`);
        const data = await response.json();
        if (response.ok) {
          setUsuarios(data.users);
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    const obtenerRoles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/getRoles`);
        const data = await response.json();
        if (response.ok) {
          setRoles(data.roles);
          setPermiso(data.roles[0]?.id || '');
        }
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    obtenerUsuarios();
    obtenerRoles();
  }, []);

  const agregarUsuario = async () => {
    if (nuevoUsuario.trim() && contrasena.trim()) {
      const nuevo = { username: nuevoUsuario, contraseña: contrasena, rol_id: permiso };

      try {
        const response = await fetch(`${API_URL}/api/users/Register_Admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevo),
        });

        const data = await response.json();

        if (response.ok) {
          setUsuarios([...usuarios, { id: Date.now(), nombre_usuario: nuevoUsuario, rol_id: permiso }]);
          setNuevoUsuario('');
          setContrasena('');
          setPermiso(roles[0]?.id || '');
        } else {
          console.error('Error al agregar usuario:', data.message || 'Mensaje no disponible');
          alert(`Error: ${data.message || 'Error desconocido'}`);
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        alert('Error en la conexión con el servidor');
      }
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/users/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsuarios(usuarios.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const cambiarRol = async (id, nuevoRolId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/updateRole/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol_id: nuevoRolId }),
      });

      if (response.ok) {
        setUsuarios(
          usuarios.map((user) =>
            user.id === id ? { ...user, rol_id: nuevoRolId } : user
          )
        );
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  // 🔧 Funciones de mantenimiento local
  const limpiarLogs = () => {
    console.clear(); // Eliminar logs visuales de la consola
    localStorage.clear(); // Limpiar almacenamiento local
    sessionStorage.clear(); // Limpiar almacenamiento de sesión
    alert('Consola, LocalStorage y SessionStorage limpiados.');
  };

  const reiniciarConfiguracion = () => {
    // Limpiar estados locales
    setNuevoUsuario('');
    setContrasena('');
    setPermiso(roles[0]?.id || '');
    setUsuarios([]);
    // Liberar variables locales (JS lo hace automáticamente, pero limpiamos referencias)
    console.log('Liberando variables temporales...');
    alert('Variables locales reiniciadas. Recargando la app...');
    setTimeout(() => window.location.reload(), 1000); // Simular reinicio de la app
  };

  return (
    <>
      <Header />
      <main className="admin-panel">
        <h2>Panel de Administración</h2>

        <section className="gestion-usuarios">
          <h3>👥 Gestión de Usuarios</h3>
          <input
            type="text"
            placeholder="Nombre del nuevo usuario"
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña del usuario"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <select value={permiso} onChange={(e) => setPermiso(e.target.value)}>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.descripcion}
              </option>
            ))}
          </select>
          <button onClick={agregarUsuario}>Agregar Usuario</button>

          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.nombre_usuario}</td>
                  <td>
                    <select
                      value={user.rol_id}
                      onChange={(e) => cambiarRol(user.id, e.target.value)}
                    >
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.descripcion}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mantenimiento">
          <h3>🛠️ Mantenimiento del Sistema</h3>
          <button onClick={limpiarLogs}>Limpiar Logs</button>
          <button onClick={reiniciarConfiguracion}>Reiniciar Configuración</button>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Admin;
