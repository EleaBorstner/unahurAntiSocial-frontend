import { useState, useEffect } from 'react';
import { type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext'; // ⚠️ VERIFICAR RUTA DEL CONTEXTO
import type { Tag, Post } from '../types';

const API_URL = 'http://localhost:3001'; 

export const CreatePost = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Estados del formulario
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  // Estados de la API
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { //Esto trae las etiquetas disponibles desde el backend.
    const fetchTags = async () => {
      try {
        const response = await axios.get<Tag[]>(`${API_URL}/tags`);
         if (response.data.length === 0) {
          setAvailableTags([ // SI NO HAY DATOS EN EL BACKEND, USAMOS ESTOS DE PRUEBA
            { id: 1, name: '#Gracioso' },
            { id: 2, name: '#Viral' },
            { id: 3, name: '#Temazo' },
            { id: 4, name: '#ComidaRica' }
          ]);
        } else {
          // SI VIENEN DATOS DEL BACKEND, LOS USAMOS
          setAvailableTags(response.data);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las etiquetas. Intentá recargar la página.');
      }
    };
    fetchTags();
  }, []);

  // Manejo de imágenes
  const handleImageChange = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addImageField = () => setImageUrls([...imageUrls, '']);
  const removeImageField = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Manejo de etiquetas
  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Enviar el formulario
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!user) {
      setError('Debés iniciar sesión para publicar.');
      return;
    }

    setLoading(true);
    try {
      // Paso A: Crear el post
      const postResponse = await axios.post<Post>(`${API_URL}/posts`, {
        description,
        userId: user.id,
        tags: selectedTags,
      });

      const createdPost = postResponse.data;

      // Paso B: Subir las imágenes
      const validUrls = imageUrls.filter((url) => url.trim() !== '');
      for (const url of validUrls) {
        await axios.post(`${API_URL}/postimages`, {
          url,
          postId: createdPost.id,
        });
      }

      // Paso C: Redirigir al perfil o a la home
      navigate('/profile'); 
      
    } catch (err: any) {
      // Manejo de errores de Axios
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error al crear la publicación.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Clases de Bootstrap: container, py-5 (padding vertical), row, justify-content-center
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center">Crear Nueva Publicación</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                
                {/* Descripción */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="¿Qué estás pensando?"
                    required
                    style={{ resize: 'none' }}
                  />
                </div>

                {/* Imágenes */}
                <div className="mb-3">
                  <label className="form-label fw-bold">URLs de imágenes (opcional)</label>
                  {imageUrls.map((url, i) => (
                    <div key={i} className="input-group mb-2">
                      <input
                        type="url"
                        className="form-control"
                        value={url}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        onChange={(e) => handleImageChange(i, e.target.value)}
                      />
                      {imageUrls.length > 1 && (
                        <button 
                          type="button" 
                          className="btn btn-outline-danger" 
                          onClick={() => removeImageField(i)}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-sm mt-1" 
                    onClick={addImageField}
                  >
                    + Agregar otra imagen
                  </button>
                </div>

                {/* Etiquetas */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Etiquetas</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.some((t) => t.id === tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          className={`btn btn-sm rounded-pill ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div> 

                {/* Botón de Enviar */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Publicando...
                      </>
                    ) : (
                      'Publicar'
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};