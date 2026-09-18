import Link from 'next/link';

interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion: number | null;
  disponible: boolean;
}

// En Next.js 15, params se tipa como una Promesa
export default async function DetalleLibro({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Desenvolvemos la promesa para obtener el ID
    const { id } = await params;

    const res = await fetch(`http://127.0.0.1:8000/api/libros/${id}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      return <div className="p-10">Error al cargar el libro. Es posible que el ID no exista.</div>;
    }

    const libro: Libro = await res.json();

    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">{libro.titulo}</h1>
        <div className="space-y-2 mb-8 text-lg">
          <p><strong>Autor:</strong> {libro.autor}</p>
          <p><strong>Año de publicación:</strong> {libro.anio_publicacion || 'Desconocido'}</p>
          <p>
            <strong>Estado:</strong>{' '}
            <span className={libro.disponible ? 'text-green-600' : 'text-red-600'}>
              {libro.disponible ? 'Disponible' : 'No disponible'}
            </span>
          </p>
        </div>
        
        <Link href="/libros" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition">
          ← Volver al listado
        </Link>
      </div>
    );
  } catch (error) {
    return <div className="p-10 text-red-500">Ocurrió un error al intentar cargar el detalle del libro.</div>;
  }
}