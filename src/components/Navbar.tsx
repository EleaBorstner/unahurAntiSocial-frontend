import { NavLink, } from 'react-router-dom';

function Navbar(){
    const getNavStyle = ({isActive}: {isActive: boolean}) => ({
      color: isActive ? '#a67d43' : '#b0b3b8',
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: 'none',
    })

    return(
        <nav 
          className="fixed-bottom border-top py-2 px-3 shadow-lg" 
          style={{backgroundColor: '#1a1b1a', borderColor: '#333 !important'}}>
            <div className="container d-flex justify-content-around align-items-center">
                <NavLink to="/" style={getNavStyle}>Inicio</NavLink>
                <NavLink to="/create-post" style={getNavStyle}>Crear Publicacion</NavLink>
                <NavLink to="/profile" style={getNavStyle}>Mi Perfil</NavLink>
                <NavLink to="/login" style={getNavStyle}>Cerrar Sesion</NavLink>
            </div>
        </nav>
    )
}

export default Navbar