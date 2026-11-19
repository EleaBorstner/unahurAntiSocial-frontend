import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import type { User, Post, Comment } from "../types";

interface ProfileProps {
  user: User | null;
}

// Este tipo es para ver la cantidad de comentarios junto al post 
type PostConComentarios = Post & {
  cantidadComentarios: number;
};

function Profile({ user }: ProfileProps) {
  const [misPosts, setMisPosts] = useState<PostConComentarios[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchMisPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Acá busca las publicaciones con un fetch de get/posts y si no las puede cargar lanza error, 
        // después filtra para mostras sólo las del usuario que está logueado, y para cada post se fija los comentarios con un get/comments/post/postId
        const response = await fetch("http://localhost:3001/posts");
        if (!response.ok) {
          throw new Error("No se pudieron cargar tus publicaciones.");
        }

        const allPosts: Post[] = await response.json();
        const userPosts = allPosts.filter((post) => post.userId === user.id);

        // Acá la promesa es para ejecutar todo a la vez pero que cada una espere a que terminen
        const postsConComentarios: PostConComentarios[] = await Promise.all(
          userPosts.map(async (post) => {
            const commentsRes = await fetch(
              `http://localhost:3001/comments/post/${post.id}`
            );
            const comments: Comment[] = commentsRes.ok
              ? await commentsRes.json()
              : [];

            return {
              ...post,
              cantidadComentarios: comments.length,
            };
          })
        );

        setMisPosts(postsConComentarios);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar las publicaciones del perfil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMisPosts();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //Esta es la página del usuario en sí, muestra las publicaciones que tenga
  return (
    <div>
      <h2>Mi Perfil</h2>
      <div>
        <p><strong>NickName:</strong> {user.nickName}</p>
      </div>

      <hr />
    
      <h3>Mis publicaciones ({misPosts.length})</h3> 

      {loading && <p>Cargando publicaciones...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && misPosts.length === 0 && (
        <p>
          Todavía no tienes publicaciones.{" "}
          <Link to="/create-post">Nueva publicación</Link>
        </p>
      )}

      {!loading && !error && misPosts.length > 0 && (
        <ul>
          {misPosts.map((post) => (
            <li key={post.id}>
              <p>{post.description}</p>
              <p>Comentarios: {post.cantidadComentarios}</p>
              <Link to={`/post/${post.id}`}>Ver más</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;