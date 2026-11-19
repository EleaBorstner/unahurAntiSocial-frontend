
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User, Post, PostImage, Comment } from "../types";

import { obtenerPostPorId } from "../services/postService";
import { obtenerImagenesPorPost } from "../services/postImageService";
import { obtenerComentariosPorPost, crearComentario } from "../services/commentService";

interface PostDetailProps {
    user: User | null;
}

function PostDetail({ user }: PostDetailProps) {
    const { id } = useParams();

    const [post, setPost] = useState<Post | null>(null);
    const [imagenes, setImagenes] = useState<PostImage[]>([]);
    const [comentarios, setComentarios] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nuevoComentario, setNuevoComentario] = useState<string>("");
    const [enviandoComentario, setEnviandoComentario] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);

                const postId = Number(id);

                const [postData, imagenesData, comentariosData] = await Promise.all([
                    obtenerPostPorId(postId),
                    obtenerImagenesPorPost(postId),
                    obtenerComentariosPorPost(postId)
                ]);

                setPost(postData);
                setImagenes(imagenesData);
                setComentarios(comentariosData);

            } catch (err) {
                console.error("Error al cargar el detalle del post:", err);
                setError("No se pudo cargar la publicación.");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handleAgregarComentario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!nuevoComentario.trim()) {
            alert("El comentario no puede estar vacío.");
            return;
        }

        if (!user) {
            alert("Tenés que iniciar sesión para comentar.");
            return;
        }

        if (!id) return;

        try {
            setEnviandoComentario(true);

            const comentarioCreado = await crearComentario(
                nuevoComentario.trim(),
                user.id,
                Number(id)
            );

            setComentarios((comentariosActuales) => [
                ...comentariosActuales,
                comentarioCreado
            ]);

            setNuevoComentario("");

        } catch (err) {
            console.error("Error al agregar el comentario:", err);
            alert("No se pudo agregar el comentario.");
        } finally {
            setEnviandoComentario(false);
        }
    };

    if (loading) {
        return <p>Cargando publicación...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!post) {
        return <p>No se encontró la publicación.</p>;
    }

    return (
        <main>
            <h2>Detalle del post</h2>

            <p>{post.description}</p>

            <div>
                {imagenes.map((imagen) => (
                    <img
                        key={imagen.id}
                        src={imagen.url}
                        alt={`Imagen del post ${post.id}`}
                    />
                ))}
            </div>

            <div>
                
              {(post.Tags || post.tags)?.map((tag) => (
                <span key={tag.id}>#{tag.name} </span>
            ))}
            </div>

            <h3>Comentarios</h3>

            {comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                    <article key={comentario.id}>
                        <p>{comentario.content}</p>
                    </article>
                ))
            ) : (
                <p>Todavía no hay comentarios.</p>
            )}

            <h3>Agregar un comentario</h3>

            <form onSubmit={handleAgregarComentario}>
                <textarea
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribí tu comentario..."
                    required
                />

                <button type="submit" disabled={enviandoComentario}>
                    {enviandoComentario ? "Enviando..." : "Publicar comentario"}
                </button>
            </form>
        </main>
    );
}

export default PostDetail;
