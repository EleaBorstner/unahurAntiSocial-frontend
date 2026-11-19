import type { Post } from "../types"

const API_URL = 'http:/localhost:3001'

export async function obtenerPosts(){
    try {
        const response = await fetch(`${API_URL}/posts`)
        if (!response.ok) {
            throw new Error('Error al obtener las publicaciones. Ver detalle: ' + response.status)
        }
        const data: Post[] = await response.json()
        return data
    } catch (error) {
        console.error('Error en obtenerPosts:', error)
        throw error
    }
} 

export async function obtenerPostPorId(id: number){
    try {
        const response = await fetch(`${API_URL}/posts/${id}`)
        if (!response.ok) {
            throw new Error('Error al obtener el post. Ver detalle: ' + response.status)
        }
        const data: Post = await response.json()
        return data
    } catch (error) {
        console.error(`Error en obtenerPostPorId (${id}):`, error)
        throw error
    }
}

export async function crearPost(description: string, userId?: string) {
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {'content-Type': 'application/json'},
            body: JSON.stringify({
                description,
                userId
            }),
        })

        if (!response.ok) {
            throw new Error('Error al crear el post: ' + response.status)
        }

        const data = await response.json()
        return data
    }catch (error) {
        console.error('Error al crear publicacion:', error)
        throw error
    }
}