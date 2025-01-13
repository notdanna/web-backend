import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
  Tooltip,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(LinearScale, PointElement, LineElement, ArcElement, Legend, Tooltip);

const InicioAdministrador = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [searchCurp, setSearchCurp] = useState("");


  // --------- Estados para EDITAR --------- //
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    curp: "",
    nombre: "",
    primer_ap: "",
    segundo_ap: "",
    contrasena: "",
    rol: "",
    id_academia: "",
    curp_jef: "",
  });

  // --------- Estados para CREAR --------- //
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    curp: "",
    numero_empleado: "",
    nombre: "",
    primer_ap: "",
    segundo_ap: "",
    contrasena: "",
    id_rol: "",
    id_academia: "",
    curp_jef: "",
    permisos_anuales: "",
  });

  // Solicitud a la API para recuperar usuarios (Read)
  useEffect(() => {
    fetch("http://localhost/web-backend/api/session/CRUD/read.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setUsuarios(data.data);
        } else {
          Swal.fire("Error", "No se pudo cargar la información de usuarios", "error");
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  }, []);
  

  // --------------------------------------------------------------------------------
  //                             CREAR USUARIO
  // --------------------------------------------------------------------------------
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    // Construir el objeto que enviamos al backend
    const payload = {
      curp: createFormData.curp.trim(),
      numero_empleado: createFormData.numero_empleado.trim(),
      nombre: createFormData.nombre.trim(),
      primer_ap: createFormData.primer_ap.trim(),
      segundo_ap: createFormData.segundo_ap.trim() || null, // Puede ser null
      contrasena: createFormData.contrasena.trim(),
      id_rol: parseInt(createFormData.id_rol, 10),
    };

    // Rol 3 => Jefe de Academia
    if (createFormData.id_rol === "3") {
      payload.id_academia = createFormData.id_academia.trim();
      payload.permisos_anuales = parseInt(createFormData.permisos_anuales, 10);
    }
    // Rol 4 => Docente
    if (createFormData.id_rol === "4") {
      payload.curp_jef = createFormData.curp_jef.trim();
      payload.id_academia = createFormData.id_academia.trim();
      payload.permisos_anuales = parseInt(createFormData.permisos_anuales, 10);
    }

    fetch("http://localhost/web-backend/api/session/CRUD/create.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire("Creado", data.message, "success");

          // Agregar el nuevo usuario al state local
          // Asumiendo que la respuesta del servidor no retorna el usuario creado,
          // podemos integrarlo manualmente con los datos que tenemos:
          const newUser = {
            curp: payload.curp,
            nombre: payload.nombre,
            primer_ap: payload.primer_ap,
            segundo_ap: payload.segundo_ap || "",
            numero_empleado: payload.numero_empleado,
            id_rol: createFormData.id_rol,
            // Podemos setear la data adicional para jefes/docentes:
            jefe_data: payload.id_rol === 3
              ? {
                  id_academia: payload.id_academia,
                  permisos_anuales: payload.permisos_anuales,
                }
              : null,
            docente_data: payload.id_rol === 4
              ? {
                  curp_jef: payload.curp_jef,
                  id_academia: payload.id_academia,
                  permisos_anuales: payload.permisos_anuales,
                }
              : null,
          };

          setUsuarios((prev) => [...prev, newUser]);

          // Cerrar el modal de creación
          setShowCreateModal(false);

          // Limpiar el formulario
          setCreateFormData({
            curp: "",
            numero_empleado: "",
            nombre: "",
            primer_ap: "",
            segundo_ap: "",
            contrasena: "",
            id_rol: "",
            id_academia: "",
            curp_jef: "",
            permisos_anuales: "",
          });
        } else {
          Swal.fire("Error", data.message || "No se pudo crear el usuario", "error");
        }
      })
      .catch((error) => {
        console.error("Error al crear usuario:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  };

  // --------------------------------------------------------------------------------
  //                             EDITAR USUARIO
  // --------------------------------------------------------------------------------
  const handleEdit = (curp) => {
    // Buscar al usuario seleccionado
    const userToEdit = usuarios.find((u) => u.curp === curp);

    if (userToEdit) {
      setFormData({
        curp: userToEdit.curp,
        nombre: userToEdit.nombre || "",
        primer_ap: userToEdit.primer_ap || "",
        segundo_ap: userToEdit.segundo_ap || "",
        contrasena: "", // Vacío => si se deja así, no se actualiza
        rol: userToEdit.id_rol,
        // Rol 3 y 4
        id_academia:
          userToEdit.jefe_data?.id_academia ||
          userToEdit.docente_data?.id_academia ||
          "",
        curp_jef: userToEdit.docente_data?.curp_jef || "",
      });

      setSelectedUser(userToEdit);
      setShowModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      curp: formData.curp,
    };

    // Campos opcionales
    if (formData.nombre.trim() !== "") payload.nombre = formData.nombre;
    if (formData.primer_ap.trim() !== "") payload.primer_ap = formData.primer_ap;
    if (formData.segundo_ap.trim() !== "") payload.segundo_ap = formData.segundo_ap;
    if (formData.contrasena.trim() !== "") payload.contrasena = formData.contrasena;

    // Si el rol es 3 o 4, enviarlo
    if (formData.rol === "3" || formData.rol === "4") {
      payload.rol = parseInt(formData.rol, 10);
    }

    // Rol 3
    if (formData.rol === "3") {
      if (formData.id_academia.trim() !== "") {
        payload.id_academia = formData.id_academia;
      }
    }
    // Rol 4
    if (formData.rol === "4") {
      if (formData.id_academia.trim() !== "") {
        payload.id_academia = formData.id_academia;
      }
      if (formData.curp_jef.trim() !== "") {
        payload.curp_jef = formData.curp_jef;
      }
    }

    fetch("http://localhost/web-backend/api/session/CRUD/update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          Swal.fire("Actualizado", data.message, "success");

          const updatedUsuarios = usuarios.map((u) => {
            if (u.curp === formData.curp) {
              return {
                ...u,
                nombre: payload.nombre ?? u.nombre,
                primer_ap: payload.primer_ap ?? u.primer_ap,
                segundo_ap: payload.segundo_ap ?? u.segundo_ap,
              };
            }
            return u;
          });

          setUsuarios(updatedUsuarios);
          setShowModal(false);
        } else {
          Swal.fire("Error", data.message || "No se pudo actualizar el usuario", "error");
        }
      })
      .catch((error) => {
        console.error("Error al actualizar usuario:", error);
        Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
      });
  };

  // --------------------------------------------------------------------------------
  //                            ELIMINAR USUARIO
  // --------------------------------------------------------------------------------
  const handleDelete = (curp) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost/web-backend/api/session/CRUD/delete.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ curp }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              Swal.fire("Eliminado", data.message, "success");
              setUsuarios(usuarios.filter((usuario) => usuario.curp !== curp));
            } else {
              Swal.fire("Error", data.message || "No se pudo eliminar el usuario", "error");
            }
          })
          .catch((error) => {
            console.error("Error al eliminar usuario:", error);
            Swal.fire("Error", "Hubo un problema al conectar con la API", "error");
          });
      }
    });
  };

  // Filtrar usuarios por rol
  const administradores = usuarios.filter((usuario) => usuario.id_rol === "1");
  const capitalHumano = usuarios.filter((usuario) => usuario.id_rol === "2");
  const jefesAcademia = usuarios.filter((usuario) => usuario.id_rol === "3");
  const docentes = usuarios.filter((usuario) => usuario.id_rol === "4");

  // Filtrar usuarios por CURP
  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.curp.toLowerCase().includes(searchCurp.toLowerCase())
  );

  // Renderizar tarjetas de usuario
  const renderUsuarios = (usuarios) =>
    usuarios.map((usuario) => (
      <div key={usuario.curp} className="col-md-4 mb-3">
        <div className="card shadow h-100">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              {usuario.nombre} {usuario.primer_ap} {usuario.segundo_ap}
            </h5>
            <p className="card-text">CURP: {usuario.curp}</p>
            <p className="card-text">Número de Empleado: {usuario.numero_empleado}</p>
            {usuario.docente_data && (
              <>
                <p className="card-text">
                  <strong>Academia:</strong> {usuario.docente_data.id_academia}
                </p>
                <p className="card-text">
                  <strong>Permisos Anuales:</strong> {usuario.docente_data.permisos_anuales}
                </p>
              </>
            )}
            {usuario.jefe_data && (
              <>
                <p className="card-text">
                  <strong>Academia:</strong> {usuario.jefe_data.id_academia}
                </p>
                <p className="card-text">
                  <strong>Permisos Anuales:</strong> {usuario.jefe_data.permisos_anuales}
                </p>
              </>
            )}
            <div className="mt-auto d-flex justify-content-between">
              <button
                onClick={() => handleEdit(usuario.curp)}
                className="btn btn-dark btn-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(usuario.curp)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="container my-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="mb-4">Bienvenido, Administrador</h1>
        {/* Botón para abrir el modal de CREAR */}
        <button
          className="btn btn-dark btn-lg d-flex align-items-center"
          onClick={() => setShowCreateModal(true)}
          >
            Crear <span className="ms-2">+</span>
        </button>
      </div>

      {/* Input de búsqueda */}
      <div className="mb-3">
        <label className="form-label">Buscar por CURP</label>
        <input
          className="form-control"
          type="text"
          placeholder="Ingrese CURP"
          value={searchCurp}
          onChange={(e) => setSearchCurp(e.target.value)}
        />
      </div>

      {/* Sección para Administradores */}
      <h2 className="mb-3">Administradores</h2>
      <div className="row">{renderUsuarios(filteredUsuarios.filter(u => u.id_rol === "1"))}</div>

      {/* Sección para Capital Humano */}
      <h2 className="mb-3">Capital Humano</h2>
      <div className="row">{renderUsuarios(filteredUsuarios.filter(u => u.id_rol === "2"))}</div>

      {/* Sección para Jefes de Academia */}
      <h2 className="mb-3">Jefes de Academia</h2>
      <div className="row">{renderUsuarios(filteredUsuarios.filter(u => u.id_rol === "3"))}</div>

      {/* Sección para Docentes */}
      <h2 className="mb-3">Docentes</h2>
      <div className="row">{renderUsuarios(filteredUsuarios.filter(u => u.id_rol === "4"))}</div>

      {/* ---------------------------------------------------------------------- */}
      {/*                MODAL para CREAR NUEVO USUARIO                          */}
      {/* ---------------------------------------------------------------------- */}
      {showCreateModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Crear Usuario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Campos comunes */}
                  <div className="mb-3">
                    <label className="form-label">CURP</label>
                    <input
                      className="form-control"
                      type="text"
                      name="curp"
                      value={createFormData.curp}
                      onChange={handleCreateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Número de Empleado</label>
                    <input
                      className="form-control"
                      type="text"
                      name="numero_empleado"
                      value={createFormData.numero_empleado}
                      onChange={handleCreateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      className="form-control"
                      type="text"
                      name="nombre"
                      value={createFormData.nombre}
                      onChange={handleCreateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Primer Apellido</label>
                    <input
                      className="form-control"
                      type="text"
                      name="primer_ap"
                      value={createFormData.primer_ap}
                      onChange={handleCreateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Segundo Apellido</label>
                    <input
                      className="form-control"
                      type="text"
                      name="segundo_ap"
                      value={createFormData.segundo_ap}
                      onChange={handleCreateChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      className="form-control"
                      type="password"
                      name="contrasena"
                      value={createFormData.contrasena}
                      onChange={handleCreateChange}
                    />
                  </div>

                  {/* Campo Rol */}
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="id_rol"
                      value={createFormData.id_rol}
                      onChange={handleCreateChange}
                    >
                      <option value="">Seleccione un rol</option>
                      <option value="1">Administrador</option>
                      <option value="2">Capital Humano</option>
                      <option value="3">Jefe de Academia</option>
                      <option value="4">Docente</option>
                    </select>
                  </div>

                  {/* Campos extras para Rol 3 y 4 */}
                  {(createFormData.id_rol === "3" || createFormData.id_rol === "4") && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">ID Academia</label>
                        <input
                          className="form-control"
                          type="text"
                          name="id_academia"
                          value={createFormData.id_academia}
                          onChange={handleCreateChange}
                        />
                      </div>
                      {createFormData.id_rol === "4" && (
                        <div className="mb-3">
                          <label className="form-label">CURP del Jefe</label>
                          <input
                            className="form-control"
                            type="text"
                            name="curp_jef"
                            value={createFormData.curp_jef}
                            onChange={handleCreateChange}
                          />
                        </div>
                      )}
                      <div className="mb-3">
                        <label className="form-label">Permisos Anuales</label>
                        <input
                          className="form-control"
                          type="number"
                          name="permisos_anuales"
                          value={createFormData.permisos_anuales}
                          onChange={handleCreateChange}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Crear Usuario
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/*                          MODAL para EDITAR                             */}
      {/* ---------------------------------------------------------------------- */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Usuario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Campos comunes */}
                  <div className="mb-3">
                    <label className="form-label">CURP (No modificable)</label>
                    <input
                      className="form-control"
                      type="text"
                      name="curp"
                      value={formData.curp}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      className="form-control"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Primer Apellido</label>
                    <input
                      className="form-control"
                      type="text"
                      name="primer_ap"
                      value={formData.primer_ap}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Segundo Apellido</label>
                    <input
                      className="form-control"
                      type="text"
                      name="segundo_ap"
                      value={formData.segundo_ap}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      className="form-control"
                      type="password"
                      name="contrasena"
                      placeholder="********"
                      value={formData.contrasena}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Si quisieras permitir cambiar el rol, descomenta esta parte:
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione un rol</option>
                      <option value="1">Administrador</option>
                      <option value="2">Capital Humano</option>
                      <option value="3">Jefe de Academia</option>
                      <option value="4">Docente</option>
                    </select>
                  </div>
                  */}

                  {/* Campos extras dependiendo del rol */}
                  {formData.rol === "3" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">ID Academia (Jefe)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="id_academia"
                          value={formData.id_academia}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                  {formData.rol === "4" && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">ID Academia (Docente)</label>
                        <input
                          className="form-control"
                          type="text"
                          name="id_academia"
                          value={formData.id_academia}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">CURP del Jefe</label>
                        <input
                          className="form-control"
                          type="text"
                          name="curp_jef"
                          value={formData.curp_jef}
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InicioAdministrador;
