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
    <div>
      <h2>Registrarse</h2>
      <small>La contraseña asignada para todas las cuentas es <strong>123456</strong>.</small>
      {/* este error solo se muestra si hay un error, por eso la condición con el && */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickName">Nombre de usuario</label>
          <input
            id="nickName"
            type="text"
            placeholder="miUsuario"
            value={nickName}
            onChange={(evento) => setNickName(evento.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="miUsuario@gmail.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>Crear cuenta</button>
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  )
}
export default Register