export interface User {
    id: number
    nickName: string
    email:string
}

export interface Post {
    id: number
    description: string
    userId: number
    UserId: number
    tags?: Tag[] //el campo tagIds es opcional. Si no se incluye, la publicación se crea sin etiquetas.
    Tags?: Tag[] //el campo tagIds es opcional. Si no se incluye, la publicación se crea sin etiquetas.
    user?: User //este por si hay que mostrar nombre
    User?: User //este por si hay que mostrar nombre
    images?: PostImage[]
    comments?: Comment[]
    Comments?: Comment[]
}

export interface Comment {
    id: number
    content: string
    userId: number
    postId: number
    user?: User //este por si hay que mostrar nombre
}

export interface Tag {
    id: number
    name: string
}

export interface PostImage {
    id: number
    url: string
    postId: number
}
