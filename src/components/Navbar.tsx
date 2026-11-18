import { NavLink, useNavigate, Link} from 'react-router-dom';
import type { User } from '../types';

//la interfaz con el user o null y la función para desloguearse
interface NavbarProps{
    user: User | null
    onLogout : () => void
}


function Navbar ({user, onLogout} : NavbarProps) {
  //hook de react para la navegación entre páginas
  const navigate = useNavigate()
  // handler para cerrar sesión y volver a la pantalla de inicio de sesión
  const handleLogoutClick = () => {
    onLogout()
    navigate("/login")
  }

    return(
        <nav>
          <Link to="/"> Unahur Anti-Social Net</Link> 

          <ul>
            <li>
              <NavLink to="/"> Inicio </NavLink>
            </li>
            <li>
              <NavLink to="/create-post">Crear Post</NavLink>
            </li>
              {user ? (
                <>
                  <li>
                    <NavLink to="/profile">Perfil ({user.nickName})</NavLink>
                  </li>
                  <li>
                    <button type="button" onClick={handleLogoutClick}> Cerrar sesión </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login">Iniciar sesión</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Registrarse</NavLink>
                  </li>
                </>
              )}
          </ul>

        </nav>
    )
}

export default Navbar