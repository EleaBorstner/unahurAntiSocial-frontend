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
    <div>
      <h2>Iniciar sesión</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nickName">Nombre de usuario</label>
          <input
            id="nickName"
            type="text"
            placeholder="Usuario1"
            value={nickName}
            onChange={(evento) => setNickName(evento.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="123456"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>Ingresar</button>
      </form>

      <p>
        ¿Todavía no tenés cuenta? <Link to="/register">Registrate acá</Link>
      </p>
    </div>
  )
}

export default Login