import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types';

//la interfaz con el user o null y la función para desloguearse
interface NavbarProps{
    user: User | null
    onLogout : () => void
}

  
function Navbar({user, onLogout}: NavbarProps){
    const navigate = useNavigate()
    const location = useLocation()

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
    
    const getNavStyle = ({isActive}: {isActive: boolean}) => ({
      color: isActive ? '#a67d43' : '#b0b3b8',
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: 'none',
    })
    
    const handleLogoutClick = () => {
      onLogout()
      navigate("/login")
    }

    return(
        <nav 
          className="fixed-bottom border-top py-2 px-3 shadow-lg" 
          style={{backgroundColor: '#1a1b1a', borderColor: '#333 !important'}}>
            <div className="container d-flex justify-content-around align-items-center">
                {user && !isAuthPage && (
                  <NavLink to="/" style={getNavStyle}>Inicio</NavLink>
                )}
                
                {user ? (
                  <>
                    <NavLink to="/profile" style={getNavStyle}>Perfil ({user.nickName})</NavLink>
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="btn btn-link p-0"
                      style={{color: '#b0b3b8', textDecoration: 'none', fontSize: 'inherit'}}
                    >
                      Cerrar Sesion
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" style={getNavStyle}>
                      Iniciar Sesion
                    </NavLink>
                    <NavLink to="/register" style={getNavStyle}>
                      Registrarse
                    </NavLink>
                  </>
                )}
            </div>
        </nav>
    )
}

export default Navbar