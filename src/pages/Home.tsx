import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerPosts } from "../services/postService"
import { obtenerUsuario } from "../services/userService";
import type { User, Post } from "../types"

interface HomeProps {
    user: User | null
}

function Home({user}: HomeProps) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [usuariosSugeridos, setUsuariosSugeridos] = useState<User[]>([]);

    const nombreMostrar = user?.nickName || 'Invitado'
    const inicial = nombreMostrar.charAt(0).toUpperCase()

    useEffect(() => {
        obtenerPosts().then((data) => {
            setPosts(data)
            setLoading(false)
        }).catch((err) => {
            console.error('Error al cargar el post:', err)
            setError('No se pudo conectar con el servidor para cargar las publicaciones.')
            setLoading(false)
        })

        obtenerUsuario().then((data) => {
            const otrosUsuarios = user
                ? data.filter((u) => u.id !== user.id)
                : data
            setUsuariosSugeridos(otrosUsuarios);
        }).catch((err) => {
            console.error('Error al cargar usuarios sugeridos', err)
        })
    }, [])

    return (
        <div style={{ backgroundColor: '#121312', minHeight: '100vh', color: '#f8f9fa' }} className="pb-5">
            <header className="container-fluid py-3 border-bottom border-secondary d-flex justify-content-end align-items-center px-4">
                <div className="d-flex flex-row align-items-center gap-2">
                    <div
                        className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold flex-shrink-0 shadow-sm"
                        style={{ width: '40px', height: '40px', backgroundColor: randomColor(), fontSize: '1.1rem', lineHeight: 1}}>
                        {inicial}
                    </div>
                    <span className="fw-bold text-nowrap" style={{ color: '#a67d43' }}>{nombreMostrar}</span>
                </div>
            </header>

            <div className="container py-4">
                <div className="row">

                    <aside className="col-12 col-lg-3 mb-4 mb-lg-0">
                        <div className="p-3 rounded border border-secondary shadow-sm" style={{backgroundColor: '#1a1b1a'}}>
                            <h5 className="fw-bold mb-3" style={{color: '#a67d43'}}>SUGERENCIAS</h5>

                            <div className="d-flex flex-column gap-3">
                                {usuariosSugeridos.length > 0 ? (
                                    usuariosSugeridos.slice(0, 4).map((user) => (
                                        <div key={user.id} className="d-flex justify-content-between align-items-center gap-2">
                                            <div className="text-start">
                                                <p className="mb-0 fw-bold small text-white">{user.nickName}</p>
                                                <small style={{color: '#b0b3b8', fontSize: '0.8rem'}}>{user.email}</small>
                                            </div>
                                            <button className="btn btn-sm text-white fw-bold px-3" style={{backgroundColor: '#ad0013', fontSize: '0.75rem'}}>Seguir</button>
                                        </div>
                                    ))  
                                ) : (
                                    <small className="text-muted-light">No hay usuarios sugeridos</small>
                                )}
                            </div>
                        </div>
                    </aside>

                    <section className="col-12 col-lg-6">

                        <div className="p-4 mb-4 rounded border shadow" style={{backgroundColor: '#1a1b1a', borderColor: '#a67d43 !important'}}>
                            <h2 className="fw-bold" style={{color: '#a67d43'}}>¡Bienvenido a UnaHur Anti-Social Net!</h2>
                            <p className="text-secondary text-light mb-0">
                                La red social de nuestra comunidad. Conectate, compartí tus ideas y enterate de lo que pasa en el campus libre de presiones.
                            </p>
                        </div>

                        <h4 className="mb-3 fw-bold" style={{color: '#a67d43'}}>Publicaciones</h4>

                        {loading ? (
                            <div className="text-center py-5">
                                <p className="text-muted">Cargando publicaciones...</p>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {posts.map((post) => (
                                    <article key={post.id} className="p-4 rounded border border-secondary shadow-sm" style={{backgroundColor: '#1a1b1a'}}>
                                        {/* Descripcion de la publicacion */}
                                        <p className="text-white mb-3">
                                            {post.description.length > 100
                                                ? `${post.description.substring(0, 100)}...`
                                                : post.description}
                                        </p>

                                        {/* Imagenes de las publicaciones (si las hay) */}
                                        {post.images && post.images.length > 0 && (
                                            <div className="mb-3">
                                                {post.images.map((img) => (
                                                    <img key={img.id} src={img.url} alt={`Imagen del post ${post.id}`}> </img>
                                                ))}
                                            </div>
                                        )}

                                        {/* Etiquetas de la publicacion */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="mb-3">
                                                {post.tags.map((tag) => (
                                                    <span key={tag.id}>#{tag.name} </span>
                                                ))}
                                            </div>
                                        )}
                                        <div>
                                            <small className="text-muted">Comentarios: {post.comments ? post.comments.length : 0}</small>
                                            <Link to={`/post/${post.id}`} className="btn btn-sm text-white fw-bold" style={{backgroundColor: '#ad0013'}}>Ver mas</Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 text-light">
                                <p>No hay publicaciones disponibles todavia.</p>
                            </div>
                        )}
                    </section>

                    <aside className="col-12 col-lg-3 d-none d-lg-block">
                        <div className="p-3 rounded border border-secondary shadow-sm" style={{backgroundColor: '#1a1b1a'}}>
                            <h5 className="fw-bold mb-2" style={{color: '#a67d43'}}>Sobre Nosotros</h5>
                            <p className="text-light small mb-0">
                                Un espacio diseñado por estudiantes de la UNAHUR para fomentar la colaboración técnica y el intercambio libre entre todos.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

function randomColor() {
    const colores = [
        '#ad0013',
        '#a67d43',
        '#5865F2',
        '#2d7d46',
        '#b85c37',
        '#7c3aed',
        '#0284c7'
    ]
    const indiceAleatorio = Math.floor(Math.random() * colores.length)
    return colores[indiceAleatorio]
}

export default Home