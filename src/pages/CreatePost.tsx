import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { crearPost } from '../services/postService';

function CreatePost() {
  const [contenido, setContenido] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const MAX_CARACTERS = 400

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const archivo = e.target.files[0]
      if (archivo.type === 'image/jpeg' || archivo.type === 'image/png') {
        setImagen(archivo)
        setError('')
      } else {
        setError('Por favor, seleccione unicamente imagenes en formato JPG o PNG.')
        e.target.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contenido.trim()) return

    setLoading(true)
    try {
      await crearPost(contenido)
      navigate('/')
    } catch (err) {
      setError('No se puso publicar. Verifique la conexion con el servidor.')
      setLoading(false)
    }
  }

  return (
    <div className="container py-4" style={{maxWidth: '600px'}}>
      <div className="p-4 rounded border border-secondary shadow-sm" style={{backgroundColor: '#1a1b1a'}}>
        <h4 className="fw-bold mb-3" style={{color: '#a67d43'}}>Crear Publicacion</h4>

        {error && <div className='alert alert-danger py-2 small'>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control border-secondary"
              rows={4}
              placeholder="¿Qué estás pensando en la comunidad?"
              value={contenido}
              maxLength={MAX_CARACTERS}
              onChange={(e) => setContenido(e.target.value)}
              style={{resize: 'none', backgroundColor: '#232523', color: '#ffffff'}}
            />
            <div className="d-flex justify-content-end mt-1">
              <small className={`${contenido.length >= MAX_CARACTERS ? 'text-danger' : 'text-muted'}`}>
                {contenido.length}/{MAX_CARACTERS}
              </small>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="formFile" className="form-label small text-light">Adjuntar Imagen</label>
            <input
              className="form-control form-control-sm bg-dark text-white border-secondary"
              type="file"
              id="formFile"
              accept=".jpg, .jpeg, .png"
              onChange={handleImagenChange}
            />
            {imagen && <small className="text-success mt-1 d-block">Imagen seleccionada: {imagen.name}</small>}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm text-white"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-sm text-white fw-bold px-4"
              style={{backgroundColor: '#ad0013'}}
              disabled={loading || !contenido.trim()}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost