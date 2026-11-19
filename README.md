# Anti-Social Net — Interfaz de Usuario

Esta es la aplicación web desarrollada en **React + TypeScript** como trabajo práctico grupal para la Universidad Nacional de Hurlingham (**UNAHUR**). Permite a los usuarios registrarse, iniciar sesión, explorar publicaciones de la comunidad, crear nuevos posts con etiquetas e imágenes, comentar y gestionar su perfil personal.

## Requisitos previos e instalación

> Para que el frontend funcione correctamente, primero debe estar corriendo el servidor **backend** de la cátedra en `http://localhost:3001`.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/EleaBorstner/unahurAntiSocial-frontend.git 
   cd  unahurAntiSocial-frontend
    ```
2. **Instalar las dependencias del proyecto:** 
    ```bash
    npm install
    ```
    (En caso de necesitar instalar manualmente las dependencias principales de enrutamiento y estilos, se utilizan **npm install react-router-dom bootstrap**).

3. **Ejecutar el entorno de desarrollo:**

    ```bash
    npm run dev
    ```
4. **Abrir la aplicación en el Navegador**

    Ingresando a:

    ```
    http://localhost:5173/
    ```

## Funcionalidades principales
* **Registro y login simulado con autenticación y persistencia de sesión:** Registro de nuevos usuarios (`POST /users`) e inicio de sesión validado contra la API (`GET /users`) con persistencia en `localStorage` y manejo centralizado del estado en `App.tsx`.
* **Home** Listado de publicaciones con autor, descripción, etiquetas, imágenes asociadas, comentarios y un panel lateral con usuarios sugeridos.
* **Detalle de publicación:** Vista completa de cada post con sus imágenes, etiquetas y comentarios.
* **Creación de publicaciones:** Formulario para usuarios autenticados que permite redactar contenido, asociar imágenes y asignar etiquetas.
* **Perfil de usuario:** Vista privada con información del usuario, que sólo se muestra si éste está correctamente logueado. Cuenta con la posibilidad de editar una breve biografía guardada localmente, un listado de publicaciones propias, un acceso directo para crear publicaciones y la posibilidad de eliminar posts (`DELETE /posts/:id`)

---

## Tecnologías utilizadas

* **[React](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)** — Construcción de interfaces de usuario basadas en componentes con tipado estático.
* **[Vite](https://vite.dev/)** — Entorno de desarrollo rápido y empaquetado del proyecto.
* **[React Router DOM](https://reactrouter.com/)** — Enrutamiento del lado del cliente (SPA) y navegación dinámica.
* **[Bootstrap 5](https://getbootstrap.com/)** — Diseño responsivo, grillas y estilos de componentes.
* **[Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)** — Consumo de la API REST local en `http://localhost:3001`.

##Integrantes
* Borstner Elea
* Iribarren Guido
* Marchese Ximena
* Nuñez Santiago