import Link from 'next/link';

// Definimos la estructura de datos para TypeScript
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  anio_publicacion: number | null;
  disponible: boolean;
}

export default async function LibrosPage() {
  try {
    // 1. Hacemos el fetch a tu API local (Paso 2)
    const res = await fetch('http://127.0.0.1:8000/api/libros', { 
      cache: 'no-store' // Para que no guarde caché y traiga datos frescos siempre
    });
    
    // Manejo de error si la API de Laravel responde con error (Paso 3)
    if (!res.ok) {
      return <div className="p-10 text-red-500">No se pudieron cargar los libros. Intentá nuevamente más tarde.</div>;
    }

    const libros: Libro[] = await res.json();

    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">Listado de Libros</h1>
        <ul className="space-y-4">
          {libros.map((libro) => (
            <li key={libro.id} className="p-4 border rounded-md shadow-sm">
              {/* Enlace al detalle (Paso 5) */}
              <Link href={`/libros/${libro.id}`} className="text-blue-600 hover:underline font-semibold text-lg">
                {libro.titulo} - {libro.autor}
              </Link>
              
              {/* Desafío Opcional C: Filtrar por disponibilidad */}
              {!libro.disponible && (
                <span className="text-red-600 font-bold ml-3 text-sm">(No disponible)</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    // Manejo de error por si el servidor de Laravel está apagado (Paso 3)
    return <div className="p-10 text-red-500">No se pudieron cargar los libros. Intentá nuevamente más tarde (Verificá que Laravel esté corriendo).</div>;
  }
}