import type {User} from '../types' //acá si no le pongo type me tira error
const API_URL= 'http://localhost:3001' //acá corre la api del profe

export async function obtenerUsuario(){ // este es del endpoint GET/users
    try{
        const response = await fetch(`${API_URL}/users`)
        if(!response.ok){
            throw new Error('Error en la respuesta del servidor. Ver detalle: ' + response.status)
        }
        const data: User[] = await response.json()
        return data
    }catch (error){
        console.error('Error inesperado al obtener usuarios:', error)
        throw error
    }
}

export async function obtenerUsuarioPorId(id: number){ // este es del endpoint GET/users/:id
    try {
        const response = await fetch(`${API_URL}/users/${id}`)
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor. Ver detalle: ' + response.status)
        }
    const data: User = await response.json()
    return data
    }catch (error){
        console.error('Error inesperado al obtener el usuario:', error)
        throw error
    }
}

export async function crearUsuario(nickName: string, email: string){ // este es del endpoint POST/users
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nickName,
                email,
            }),
        });
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.status)
        }
    const data: User = await response.json()
    return data
    } catch(error) {
        console.error('Algo salió mal al crear el usuario:', error)
        throw error
    }
}

