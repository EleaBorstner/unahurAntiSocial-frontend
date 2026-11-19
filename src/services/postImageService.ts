
import type { PostImage } from "../types";

const API_URL = "http://localhost:3001";

export async function obtenerImagenesPorPost(postId: number) {
    try {
        const response = await fetch(`${API_URL}/postimages/post/${postId}`);

        if (!response.ok) {
            throw new Error("Error al obtener las imágenes. Ver detalle: " + response.status);
        }

        const data: PostImage[] = await response.json();
        return data;

    } catch (error) {
        console.error(`Error en obtenerImagenesPorPost (${postId}):`, error);
        throw error;
    }
}
