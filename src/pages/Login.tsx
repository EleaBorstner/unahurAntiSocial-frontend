import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "../types";
import {obtenerUsuario} from "../services/userService"

interface LoginProps {
  onLogin: (userData: User) => void
}

//función para el login, consulta la lista de usuarios registrados con un fetch a la api (get/users), y si existe se fija si 
//la contraseña es la que indica la consigna, después según corresponda inicia la sesión y redirige a inicio o no. 
function Login({ onLogin }: LoginProps) {

  // Estados para los campos del formulario, los errores y carga, y el hook de navegación
  const [nickName, setNickName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

// handler para no recargar la pagina con el envio
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!nickName.trim()) {
      setError("Por favor ingrese un nombre de usuario registrado.")
      return;
    }
    if (!password.trim()) {
      setError("Por favor ingrese una contraseña.")
      return;
    }
    if (password !== "123456") {
      setError("La contraseña ingresada es incorrecta.")
      return;
    }
      
    try { 
      setLoading(true)
      const users = await obtenerUsuario()
      const searchNick = nickName.trim().toLowerCase()
      const foundUser = users.find((u: User) => u.nickName.toLowerCase() === searchNick)

      if (!foundUser) {
        setError("No encontramos ningún usuario con ese nickName.")
        return;
      }
      onLogin(foundUser)
      navigate("/")

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al conectar con el servidor para iniciar sesión."
      )
    } finally {
      setLoading(false);
    }
  }

  //este es el formulario en sí
  return (
    <div className="d-flex align-items-center py-4 text-light" style={{backgroundColor: '#131213', minHeight: 'calc(100vh - 56px)'}}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">

            <div className="card bg-dark text-light border-secondary mb-4 shadow-sm">
              <div className="card-body p-4 text-center">
                <h1 className="fw-bold mb-2 fs-2" style={{color: '#a67d43'}}>¡Bienvenido a UnaHur Anti-Social Net!</h1>
                <p className="card-text mb-0 text-light">
                  La red social de nuestra comunidad. Conectate, compartí tus ideas y enterate de lo que pasa en el campus libre de presiones.
                </p>
              </div>
            </div>

            <div className="card bg-dark text-light border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title h4 fw-bold mb-4 text-center" style={{color: '#a67d43'}}>Iniciar sesión</h2>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="text-start">
                  <div className="mb-3">
                    <label htmlFor="nickName" className="form-label d-block fw-semibold">Nombre de usuario</label>
                    <input
                      id="nickName"
                      type="text"
                      className="form-control border-secondary"
                      placeholder="Usuario1"
                      value={nickName}
                      onChange={(evento) => setNickName(evento.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="from-label d-block fw-semibold">Contraseña</label>
                    <input
                      id="password"
                      type="password"
                      className="form-control border-secondary"
                      placeholder="123456"
                      value={password}
                      onChange={(evento) => setPassword(evento.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button 
                    className="btn w-100 fw-semibold text-White" 
                    style={{backgroundColor: '#ad0013', borderColor: '#ad0013'}} 
                    type="submit" 
                    disabled={loading}>
                      {loading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <p className="mt-3 mb-0 small text-secondary">
                  ¿Todavía no tenés cuenta? <Link to="/register" className="fw-semibold text-decoration-none" style={{color: '#a67d43'}}>Registrate acá</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login