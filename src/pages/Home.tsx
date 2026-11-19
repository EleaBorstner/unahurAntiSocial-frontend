import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerPosts } from "../services/postService"
import { obtenerUsuario } from "../services/userService";
import { obtenerImagenesPorPost } from "../services/postImageService";
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
        obtenerPosts().then(async (data) => {
        const postsConImagenes = await Promise.all(data.map(async (post) => {
            const imgs = await obtenerImagenesPorPost(post.id).catch(() => []);
            return { ...post, images: imgs };
        }));
        setPosts(postsConImagenes);
        setLoading(false);
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
                        style={{ width: '40px', height: '40px', backgroundColor: colorPorNombre(nombreMostrar), fontSize: '1.1rem', lineHeight: 1}}>
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
                                            <div className="text-start overflow-hiden" style={{minWidth: 0}}>
                                                <p className="mb-0 fw-bold small text-white text-truncate">{user.nickName}</p>
                                                <small className="d-block text-truncate" style={{color: '#b0b3b8', fontSize: '0.8rem'}}>{user.email}</small>
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

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-3 fw-bold" style={{color: '#a67d43'}}>Publicaciones</h4>

                            {user && (
                                <Link to="/create-post" className="btn btn-sm text-white fw-bold px-3"
                                style={{backgroundColor: '#ad0013'}}>
                                    + Crear Publicacion
                                </Link>
                            )}
                        </div>

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
                                {posts.map((post) => {
                                    const autorNombre = post.User?.nickName || "Usuario"
                                    const autorInicial = autorNombre.charAt(0).toUpperCase()

                                    return (
                                        <article key={post.id} className="p-4 rounded border border-secondary shadow-sm" style={{backgroundColor: '#1a1b1a'}}>
                                            {/* Autor de la publicación arriba a la izquierda */}
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div
                                                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold flex-shrink-0"
                                                style={{
                                                    width: "28px",
                                                    height: "28px",
                                                    backgroundColor: colorPorNombre(autorNombre),
                                                    fontSize: "0.8rem",
                                                    lineHeight: 1,
                                                }}
                                                >
                                                {autorInicial}
                                                </div>
                                                <span
                                                className="fw-semibold small"
                                                style={{ color: "#a67d43" }}
                                                >
                                                {autorNombre}
                                                </span>
                                            </div>

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
                                                        <img key={img.id} src={img.url} alt={`Imagen del post ${post.id}`} className="img-fluid rounded border border-secondary" style={{ maxHeight: "360px", objectFit: "cover" }}/>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Etiquetas de la publicacion */}
                                            {post.Tags && post.Tags.length > 0 && (
                                                <div className="mb-3">
                                                    {post.Tags.map((tag) => (
                                                        <span key={tag.id} style={{ color: "#a67d43" }}>#{tag.name.replace(/^#+/, "")} </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <small style={{color: '#b0b3b8'}}>Comentarios: {(post as any).Comments ? (post as any).Comments.length : post.comments ? post.comments.length : 0}</small>
                                                <Link to={`/post/${post.id}`} className="btn btn-sm text-white fw-bold px-3 flex-shink-0" style={{backgroundColor: '#ad0013'}}>Ver mas</Link>
                                            </div>
                                        </article>
                                    )
                                })}
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

function colorPorNombre(texto: string) {
  const colores = [
    "#ad0013",
    "#a67d43",
    "#5865F2",
    "#2d7d46",
    "#b85c37",
    "#7c3aed",
    "#0284c7",
  ];
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colores[Math.abs(hash) % colores.length];
}

export default Home