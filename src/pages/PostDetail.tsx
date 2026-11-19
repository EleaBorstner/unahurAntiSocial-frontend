import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { User, Post, PostImage, Comment } from "../types";

import { obtenerPostPorId } from "../services/postService";
import { obtenerImagenesPorPost } from "../services/postImageService";
import { obtenerComentariosPorPost, crearComentario } from "../services/commentService";

interface PostDetailProps {
  user: User | null;
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
          obtenerComentariosPorPost(postId),
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
        comentarioCreado,
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
    return (
      <div
        className="min-vh-100 py-5 text-center text-light"
        style={{ backgroundColor: "#121312" }}
      >
        <p className="text-secondary">Cargando publicación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-vh-100 py-5 text-light"
        style={{ backgroundColor: "#121312" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
              <div className="text-center mt-3">
                <Link
                  to="/"
                  className="btn btn-sm fw-bold text-white px-3"
                  style={{ backgroundColor: "#ad0013" }}
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-vh-100 py-5 text-center text-light"
        style={{ backgroundColor: "#121312" }}
      >
        <p className="text-secondary">No se encontró la publicación.</p>
        <Link
          to="/"
          className="btn btn-sm fw-bold text-white px-3 mt-2"
          style={{ backgroundColor: "#ad0013" }}
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const autorNombre = post.User?.nickName || "Usuario";
  const autorInicial = autorNombre.charAt(0).toUpperCase();
  const tagsLista = post.Tags || post.tags || [];

    return (
    <div
      className="min-vh-100 py-4 pb-5 text-light"
      style={{ backgroundColor: "#121312" }}
    >
      <main className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            {/* Barra superior con volver */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 fw-bold mb-0" style={{ color: "#a67d43" }}>
                Detalle de la publicación
              </h2>
              <Link
                to="/"
                className="btn btn-sm btn-outline-secondary fw-semibold text-light"
              >
                ← Volver
              </Link>
            </div>

            {/* Tarjeta principal del post */}
            <article className="p-4 rounded border border-secondary shadow-sm mb-4" style={{ backgroundColor: "#1a1b1a" }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold flex-shrink-0"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: colorPorNombre(autorNombre),
                    fontSize: "0.85rem",
                    lineHeight: 1,
                  }}
                >
                  {autorInicial}
                </div>
                <span className="fw-semibold" style={{ color: "#a67d43" }}>
                  {autorNombre}
                </span>
              </div>

              <p className="text-white mb-3" style={{ whiteSpace: "pre-line" }}>
                {post.description}
              </p>

              {imagenes.length > 0 && (
                <div className="d-flex flex-column gap-3 mb-3">
                  {imagenes.map((imagen) => (
                    <img
                      key={imagen.id}
                      src={imagen.url}
                      alt={`Imagen del post ${post.id}`}
                      className="img-fluid rounded border border-secondary"
                    />
                  ))}
                </div>
              )}

              {tagsLista.length > 0 && (
                <div className="mb-2">
                  {tagsLista.map((tag) => (
                    <span
                      key={tag.id}
                      className="me-2 small fw-semibold"
                      style={{ color: "#a67d43" }}
                    >
                      #{tag.name.replace(/^#+/, "")}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Sección de comentarios */}
            <section className="p-4 rounded border border-secondary shadow-sm mb-4" style={{ backgroundColor: "#1a1b1a" }}>
              <h3 className="h5 fw-bold mb-3" style={{ color: "#a67d43" }}>
                Comentarios ({comentarios.length})
              </h3>

              {comentarios.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {comentarios.map((comentario) => (
                    <article key={comentario.id} className="p-3 rounded border border-secondary" style={{ backgroundColor: "#121312" }}>
                      <p className="mb-0 text-light small">
                        {comentario.content}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mb-0 small" style={{ color: "#b0b3b8" }}>
                  Todavía no hay comentarios.
                </p>
              )}
            </section>

            {/* Formulario para agregar comentario */}
            <section className="p-4 rounded border border-secondary shadow-sm" style={{ backgroundColor: "#1a1b1a" }}>
              <h3 className="h5 fw-bold mb-3" style={{ color: "#a67d43" }}>
                Agregar un comentario
              </h3>

              <form onSubmit={handleAgregarComentario}>
                <div className="mb-3">
                  <textarea
                    className="form-control border-secondary"
                    rows={3}
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                    placeholder="Escribí tu comentario..."
                    required
                    style={{ resize: "none" }}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn fw-bold text-white px-4"
                    style={{
                      backgroundColor: "#ad0013",
                      borderColor: "#ad0013",
                    }}
                    disabled={enviandoComentario}
                  >
                    {enviandoComentario
                      ? "Enviando..."
                      : "Publicar comentario"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostDetail;
