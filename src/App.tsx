import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home  from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PostDetail from './pages/PostDetail';
import { CreatePost } from './pages/CreatePost';
import { Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

function AppContent() { 
  const {user, login, logout} = useUser()

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={login}/>} />
        <Route path="/register" element={<Register onLogin={login}/>} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/post/:id" element={<PostDetail user={user} />} />
        <Route path="/create-post" element={user ? <CreatePost /> : <Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App;