import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home  from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import {CreatePost} from './pages/CreatePost';
import {useState} from 'react';
import type {User} from './types'

function App() { 
  // acá está el estado del usuario para que lo usen perfil, login y registro
  // usuario puede ser null o un usuario, y al recargar la página revisa si hay algo en local sotrage para que no se cierre la sesión
  const [user, setUser] = useState<User | null> (() => { 
    const savedUser = localStorage.getItem("user")
    return savedUser ? JSON.parse(savedUser): null
  })

  // handler para el login, si el usuario está validado de login o registro recibe los datos y setea el estado. 
  // lo gurda en local storage para la persistencia
  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData))
  }

  // handler para el logout, setea el estado a null y lo borra del storage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin}/>} />
        <Route path="/register" element={<Register onLogin={handleLogin}/>} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/post/:id" element={<PostDetail user={user} />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;