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
  const [newTagName, setNewTagName] = useState('');
  const [creatingTag, setCreatingTag] = useState(false);
  
  // Estados de la API
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { //Esto trae las etiquetas disponibles desde el backend.
    const fetchTags = async () => {
      try {
        const response = await axios.get<Tag[]>(`${API_URL}/tags`);
        setAvailableTags(response.data);
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

  // Manejo de etiquetas existentes
  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Crear y seleccionar un nuevo tag
  const handleAddNewTag = async () => {
    const cleanName = newTagName.replace(/^#+/, '').trim();
    if (!cleanName) return;

    const formattedName = `#${cleanName}`;

    // Si ya existe en los sugeridos, solo lo marcamos como seleccionado
    const existingTag = availableTags.find(
      (t) => 
        t.name.toLowerCase() === formattedName.toLowerCase() ||
        t.name.replace(/^#+/, '').toLowerCase() === cleanName.toLowerCase()
    );
    if (existingTag) {
      if (!selectedTags.some((t) => t.id === existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag]);
      }
      setNewTagName('');
      return;
    }

    try {
      setCreatingTag(true);
      const response = await axios.post<Tag>(`${API_URL}/tags`, {
        name: formattedName,
      });
      const createdTag = response.data;

      setAvailableTags((prev) =>
        prev.some((t) => t.id === createdTag.id) ? prev : [...prev, createdTag]
      );
      setSelectedTags((prev) =>
        prev.some((t) => t.id === createdTag.id) ? prev : [...prev, createdTag]
      );
      setNewTagName('');
    } catch (err) {
      console.error('Error al crear etiqueta:', err);
      setError('No se pudo crear la nueva etiqueta.');
    } finally {
      setCreatingTag(false);
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
        tags: selectedTags.map((tag) => tag.id),
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
    <div className="min-vh-100 py-5 pb-5 text-light" style={{backgroundColor: '#121312'}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            
            <div className="card bg-dark text-light border-secondary shadow-sm">
              <div className="card-body p-4">
                <h2 className="card-title h-4fw-bold mb-4 text-center" style={{color: '#a67d43'}}>Crear Nueva Publicación</h2>

                {error && (
                  <div className="alert alert-danger py-2 text-center" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* Descripción */}
                  <div className="mb-3">
                    <label className="form-label d-block fw-semibold">Descripción</label>
                    <textarea
                      className="form-control border-secondary"
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
                    <label className="form-label d-block fw-semibold">URLs de imágenes (opcional)</label>
                    {imageUrls.map((url, i) => (
                      <div key={i} className="input-group mb-2">
                        <input
                          type="url"
                          className="form-control border-secondary"
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
                    <label className="form-label d-block fw-semibold">Etiquetas sueridas</label>
                      {availableTags.length > 0 ?(
                        <div className="d-flex flex-wrap gap-2">
                          {availableTags.map((tag) => {
                            const isSelected = selectedTags.some((t) => t.id === tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                className="btn btn-sm rounded-pill fw-semibold"
                                style={
                                  isSelected
                                    ? {
                                        backgroundColor: '#a67d43',
                                        borderColor: '#a67d43',
                                        color: '#121312',
                                      }
                                    : {
                                        backgroundColor: 'transparent',
                                        borderColor: '#6c757d',
                                        color: '#f8f9fa',
                                      }
                                }
                                onClick={() => toggleTag(tag)}
                              >
                                {tag.name}
                              </button>
                            );
                        })}
                      </div>
                      ) : (
                        <small className="text-secondary">
                          No hay etiquetas sugeridas todavia.
                        </small>
                      )}
                  </div> 

                  {/* Campo para escribir un nuevo tag */}
                  <div className="mb-4">
                    <label
                      htmlFor="newTagInput"
                      className="form-label d-block small text-secondary fw-semibold"
                    >
                      ¿No encontrás tu etiqueta? Creá una nueva
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text fw-bold border-secondary"
                        style={{ backgroundColor: '#1a1b1a', color: '#a67d43' }}
                      >
                        #
                      </span>
                      <input
                        id="newTagInput"
                        type="text"
                        className="form-control border-secondary"
                        placeholder="Ej: Programacion o #UNAHUR"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNewTag();
                          }
                        }}
                        disabled={creatingTag}
                      />
                      <button
                        type="button"
                        className="btn fw-semibold"
                        style={{
                          backgroundColor: '#ad0013',
                          borderColor: '#ad0013',
                          color: '#121312',
                        }}
                        onClick={handleAddNewTag}
                        disabled={creatingTag || !newTagName.trim()}
                      >
                        {creatingTag ? 'Agregando...' : 'Agregar tag'}
                      </button>
                    </div>
                  </div>

                  {/* Botón de Enviar */}
                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-lg fw-semibold text-white"
                      style={{backgroundColor: '#ad0013', borderColor: '#ad0013'}}
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
    </div>
  );
};