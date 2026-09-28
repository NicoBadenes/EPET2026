import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Estás sin conexión</h1>
      <p className="text-lg mb-8">Por favor, revisá tu conexión a internet para ver el listado de la biblioteca.</p>
      <Link href="/libros" className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">
        Intentar de nuevo
      </Link>
    </div>
  );
}