import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { obtenerPosts } from "../services/postService";
import { obtenerImagenesPorPost } from "../services/postImageService";
import type { User, Post, PostImage} from "../types";

interface ProfileProps {
  user: User | null;
}

// Este tipo es para ver la cantidad de comentarios junto al post 
type PostConImagenes = Post & {
  imagenes: PostImage[];
};

function Profile({ user }: ProfileProps) {
  const [misPosts, setMisPosts] = useState<PostConImagenes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null)
  
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [bio, setBio] = useState("")
  const [bioDraft, setBioDraft] = useState("")

  useEffect(() => {
    if (!user) return;
    const savedBio =
      localStorage.getItem(`bio_user_${user.id}`) ??
      "Estudiante de la UNAHUR. Compartiendo ideas en Anti-Social Net.";
    setBio(savedBio);
    setBioDraft(savedBio);
  }, [user]);

  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError(null)

    obtenerPosts().then(async (data) => {
      const userPosts = data.filter((post) => Number(post.UserId) === Number(user.id))
      const postsConImagenes = await Promise.all( 
        userPosts.map(async (post) => {
          const imgs = await obtenerImagenesPorPost(post.id).catch(() => []);
          return { ...post, imagenes: imgs };
        })
      );
      setMisPosts(postsConImagenes);
      setLoading(false);
    }).catch((err) => {
      console.error("error al cargar las publicaciones del perfil:", err)
      setError(
        "No se pudo conectar con el servidor para cargar tus publicaciones."
      )
      setLoading(false)
    })
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const handleSaveBio = () => {
    const trimmed = bioDraft.trim()
    setBio(trimmed)
    localStorage.setItem(`bio_user_${user.id}`, trimmed)
    setIsEditingBio(false)
  }

  const handleDeletePost = async (postId: number) => {
    const confirmado = window.confirm(
      "¿Seguro que querés eliminar esta publicación?"
    )
    if (!confirmado) return

    try {
      setDeletingId(postId)
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("No se pudo eliminar la publicacion.")
      }

      setMisPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Ocurrio un error al intentar eliminar la publicacion."
      )
    } finally {
      setDeletingId(null)
    }
  }

  //Esta es la página del usuario en sí, muestra las publicaciones que tenga
  return (
    <div
      className="min-vh-100 py-4 pb-5 text-light"
      style={{ backgroundColor: "#121312" }}
    >
      <div className="container" style={{ maxWidth: "760px" }}>
        {/* Cabecera estilo Instagram */}
        <div className="card bg-dark text-light border-secondary shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-4">
              {/* Foto de perfil grande a la izquierda */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
                style={{
                  width: "96px",
                  height: "96px",
                  backgroundColor: "#121312",
                  border: "2px solid #a67d43",
                  color: "#a67d43",
                  fontSize: "2.4rem",
                }}
              >
                {user.nickName.charAt(0).toUpperCase()}
              </div>

              {/* Info derecha: nombre + botón editar perfil arriba, métricas abajo */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div>
                    <h2
                      className="h4 fw-bold mb-0"
                      style={{ color: "#a67d43" }}
                    >
                      {user.nickName}
                    </h2>
                    <small className="text-secondary">{user.email}</small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light fw-semibold"
                    onClick={() => {
                      setBioDraft(bio);
                      setIsEditingBio((prev) => !prev);
                    }}
                  >
                    {isEditingBio ? "Cancelar" : "Editar perfil"}
                  </button>
                </div>

                {/* Métricas estilo IG */}
                <div className="d-flex gap-4 text-center text-sm-start">
                  <div>
                    <span className="fw-bold d-block d-sm-inline me-sm-1">
                      {misPosts.length}
                    </span>
                    <span className="text-secondary small">publicaciones</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block d-sm-inline me-sm-1">
                      0
                    </span>
                    <span className="text-secondary small">seguidores</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block d-sm-inline me-sm-1">
                      0
                    </span>
                    <span className="text-secondary small">seguidos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción abajo (y formulario desplegable al editar) */}
            <div className="mt-3 pt-3 border-top border-secondary">
              {isEditingBio ? (
                <div>
                  <label
                    htmlFor="bioInput"
                    className="form-label d-block small text-secondary fw-semibold"
                  >
                    Descripción del perfil
                  </label>
                  <textarea
                    id="bioInput"
                    rows={2}
                    maxLength={160}
                    className="form-control bg-black text-white border-secondary mb-2"
                    placeholder="Contá algo sobre vos..."
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm fw-semibold text-white"
                      style={{
                        backgroundColor: "#ad0013",
                        borderColor: "#ad0013",
                      }}
                      onClick={handleSaveBio}
                    >
                      Guardar descripción
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mb-0 small text-light" style={{ whiteSpace: "pre-line" }}>{bio || "Sin descripción todavía."}</p>
              )}
            </div>
          </div>
        </div>

        {/* Encabezado sección de publicaciones */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="h5 fw-bold mb-0" style={{ color: "#a67d43" }}>Publicaciones ({misPosts.length})</h3>
          <Link to="/create-post" className="btn btn-sm fw-semibold text-white" style={{ backgroundColor: "#ad0013", borderColor: "#ad0013" }}>
            + Crear Publicación
          </Link>
        </div>

        {loading && (
          <div className="text-center py-4">
            <p className="text-secondary">Cargando publicaciones...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && misPosts.length === 0 && (
          <div className="card bg-dark text-light border-secondary text-center p-4">
            <p className="text-secondary mb-3">Todavía no tenés publicaciones en tu perfil.</p>
            <div>
              <Link to="/create-post" className="btn btn-sm fw-semibold text-white" style={{ backgroundColor: "#ad0013", borderColor: "#ad0013" }}>
                Hacer mi primera publicación
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && misPosts.length > 0 && (
          <div className="d-flex flex-column gap-3 mb-4">
            {misPosts.map((post) => (
              <article key={post.id} className="card bg-dark text-light border-secondary shadow-sm">
                <div className="card-body p-4">
                  <p className="card-text fs-6 mb-3">
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                  </p>
                  {post.imagenes && post.imagenes.length > 0 && (
                    <div className="d-flex flex-column gap-2 mb-3">
                    {post.imagenes.map((imagen) => (
                      <img
                        key={imagen.id}
                        src={imagen.url}
                        alt={`Imagen del post ${post.id}`}
                        className="img-fluid rounded border border-secondary"
                        style={{ maxHeight: "360px", objectFit: "cover" }}
                      />
                      ))}
                  </div>
                  )}
                  {post.Tags && post.Tags.length > 0 && (
                    <div className="mb-3">
                      {post.Tags.map((tag) => (
                        <span key={tag.id} className="me-2 small" style={{ color: "#a67d43" }}>
                          #{tag.name.replace(/^#+/, "")}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <small style={{color: "#b0b3b8"}}>
                      Comentarios: {(post as any).Comments ? (post as any).Comments.length : post.comments ? post.comments.length : 0}
                    </small>

                    <div className="d-flex gap-2">
                      <Link to={`/post/${post.id}`} className="btn btn-sm fw-semibold text-white" style={{backgroundColor: "#ad0013", borderColor: "#ad0013"}}>
                        Ver más
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger fw-semibold"
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;