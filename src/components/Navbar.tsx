import { NavLink, } from 'react-router-dom';

function Navbar(){
    return(
        <nav>
          <NavLink to="/"> Unahur Anti-Social Net</NavLink> 
          <div>
            <NavLink to="/"> Inicio </NavLink>
            <NavLink to="/create-post">Crear Post</NavLink>
            <NavLink to="/profile">Perfil</NavLink>
          </div>

          <div>
            <NavLink to="/login" > Login </NavLink>
            <NavLink to="/register"> Registrarse </NavLink>
          </div>
        </nav>
    )
}

export default Navbar