import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import Container from "react-bootstrap/Container"
//import Row from "react-bootstrap/Row"
//import Col from "react-bootstrap/Col"
//import Card from "react-bootstrap/Card"
//import Button from "react-bootstrap/Button"
//import Badge from "react-bootstrap/Badge"
import { obtenerPosts } from "../services/postService"
import type { Post } from "../types"

function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        obtenerPosts().then((data) => {
            setPosts(data)
            setLoading(false)
        }).catch((err) => {
            console.error('Error al cargar el post:', err)
            setError('No se pudo conectar con el servidor para cargar las publicaciones.')
            setLoading(false)
        })
    }, [])

    return (
        <main>
            {/* Banner de bienvenida */}
            <section>
                <h1>Bienvenido a UnaHur Anti-Social Net</h1>
                <p>
                    La red social oficial de nuestra comunidad universitaria. Conectate, compati tus ideas y enterate de lo que pasa en el campus.
                </p>
            </section>

            {/* Seccion "Sobre Nosotros" */}
            <section>
                <h2>Soobre Nosotros</h2>
                <p>
                    Un espacio libre de presiones sociales tradicionales, diseñado por estudiantes de la UNAHUR para fomentar la colaboracion, el intercambio tecnico y la buena onda entre todos.
                </p>
            </section>

            {/* Feed de publicaciones recientes */}
            <section>
                <h2>Feed de Publicaciones Recientes</h2>

                {loading ? (
                    <p>Cargando publicaciones...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : posts.length > 0 ? (
                    <div>
                        {posts.map((post) => (
                            <article key={posts.id}>
                                <p>
                                    {posts.description.length > 100 
                                    ? `${posts.description.substring(0, 100)}...` 
                                    : post.description}
                                </p>

                                {posts.tags && posts.tags.length > 0 && (
                                    <div>
                                        {posts.tags.map((tag) => (
                                            <span key={tag.id}>#{tag.name} </span>
                                        ))}
                                    </div>
                                )}
                            
                                <Link to={`/post/${posts.id}`}>Ver mas</Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p>No hay publicaciones disponibles todavia.</p>
                )}
            </section>
        </main>
    );
}

export default Home