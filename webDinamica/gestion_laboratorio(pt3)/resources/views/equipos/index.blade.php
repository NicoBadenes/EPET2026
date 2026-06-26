<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Laboratorio</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 min-h-screen p-8 text-gray-800">
    <div class="max-w-7xl mx-auto">

        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Equipos del Laboratorio</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl shadow-inner mb-12">
            
            @forelse($equipos as $equipo)
                <div class="bg-white rounded-xl shadow-md border border-gray-100 transition hover:shadow-lg overflow-hidden">
                    
                    @if(!empty($equipo->imagen_ruta))
                        <img src="{{ asset($equipo->imagen_ruta) }}" alt="Foto del equipo" class="w-full h-48 object-cover">                    @else
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 italic">
                            Sin fotografía cargada.
                        </div>
                    @endif

                    <div class="p-5 flex flex-col h-full">
                        <h3 class="text-lg font-bold text-gray-800">{{ $equipo->nombre }}</h3>
                        <p class="text-sm text-gray-500 mt-1">Nº Serie: {{ $equipo->numero_serie }}</p>
                        
                        <p class="text-sm text-gray-600 mt-3 mb-4 flex-grow">{{ $equipo->descripcion ?? 'Sin observaciones' }}</p>

                        <div class="mt-auto">
                            <span class="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                Ubicación: {{ $equipo->aula->nombre_sala }}
                            </span>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p class="text-gray-500 text-lg">⚠️ No hay equipos registrados en el sistema actualmente.</p>
                </div>
            @endforelse
        </div>

        <hr class="my-10 border-gray-300">

        <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Registrar Nuevo Equipo</h2>
            
            <form action="{{ route('equipos.store') }}" method="POST" enctype="multipart/form-data" class="space-y-5">
                @csrf
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Componente:</label>
                    <input type="text" name="nombre" class="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring focus:ring-blue-200" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Número de Serie / Patrimonio:</label>
                    <input type="text" name="numero_serie" class="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring focus:ring-blue-200" required>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción / Detalles:</label>
                    <textarea name="descripcion" class="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring focus:ring-blue-200" rows="3"></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Asignar a un Aula:</label>
                    <select name="aula_id" class="w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring focus:ring-blue-200" required>
                        <option value="">Seleccione un aula...</option>
                        @foreach($aulas as $aula)
                            <option value="{{ $aula->id }}">{{ $aula->nombre_sala }}</option>
                        @endforeach
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fotografía del Hardware:</label>
                    <input type="file" name="foto_equipo" accept=".jpg, .png" class="w-full rounded-md border-gray-300 shadow-sm border p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring focus:ring-blue-200">
                </div>
                
                <div class="pt-4">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition w-full shadow-sm">
                        Guardar Equipo
                    </button>
                </div>
            </form>
        </div>

    </div>
</body>
</html>