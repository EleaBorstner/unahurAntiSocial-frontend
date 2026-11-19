
import type { Comment } from "../types";

const API_URL = "http://localhost:3001";

// Obtener los comentarios de una publicación
export async function obtenerComentariosPorPost(postId: number) {
    try {
        const response = await fetch(`${API_URL}/comments/post/${postId}`);

        if (!response.ok) {
            throw new Error("Error al obtener los comentarios. Ver detalle: " + response.status);
        }

        const data: Comment[] = await response.json();
        return data;

    } catch (error) {
        console.error(`Error en obtenerComentariosPorPost (${postId}):`, error);
        throw error;
    }
}

// Crear un comentario nuevo
export async function crearComentario(content: string, userId: number, postId: number) {
    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content,
                userId,
                postId
            })
        });

        if (!response.ok) {
            throw new Error("Error al crear el comentario. Ver detalle: " + response.status);
        }

        const data: Comment = await response.json();
        return data;

    } catch (error) {
        console.error("Error en crearComentario:", error);
        throw error;
    }
}
