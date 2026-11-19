import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "../types";
import { crearUsuario } from "../services/userService";

// Interface para cuando el usuario se registra
interface RegisterProps {
  onLogin: (userData: User) => void
}

function Register({ onLogin }: RegisterProps) {
   // Estados para los inputs del formulario, errores y carga, y el hook para navegación
  const [nickName, setNickName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // handler para que no se recargue toda la página con el envio del formulario, da error si hay campo vacío
  // llama al post/users para el usuario con el id, lo guarda en el estado global y vuelve a inicio
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!nickName.trim() || !email.trim()) {
      setError("Por favor complete todos los campos.")
      return;
    }
    try {
      setLoading(true);
      const createdUser = await crearUsuario(nickName.trim(), email.trim())

      onLogin(createdUser);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el usuario. Por favor elija un mail o nickname distinto."
      );
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="d-flex align-items-center py-4 text-light" style={{backgroundColor: '#131213', minHeight: 'calc(100vh - 56px)'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card bg-dark text-light border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title h4 fw-bold mb-2 text-center" style={{color: '#a67d43'}}>
                  Registrarse
                </h2>

                <p className="small text-secondary text-center mb-4">
                  La contraseña asignada para todas las cuentas es <strong className="text-light">123456</strong>.
                </p>

                {/* este error solo se muestra si hay un error, por eso la condición con el && */}
                {error && (
                  <div className="alert alert-danger py-2 text-center" role="alert">
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
                      placeholder="miUsuario"
                      value={nickName}
                      onChange={(evento) => setNickName(evento.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label d-block fw-semibold">Correo electrónico</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control border-secondary"
                      placeholder="miUsuario@gmail.com"
                      value={email}
                      onChange={(evento) => setEmail(evento.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <button 
                    className="btn w-100 fw-semibold text-White" 
                    style={{backgroundColor: '#ad0013', borderColor: '#ad0013'}} 
                    type="submit" 
                    disabled={loading}>
                      {loading ? 'Crando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="mt-3 mb-0 small text-secondary">
                  ¿Ya tenés cuenta? <Link to="/login" className="fw-semibold text-decoration-none" style={{color: '#a67d43'}}>Iniciá sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Register