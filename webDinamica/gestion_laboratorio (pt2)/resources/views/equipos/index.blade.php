<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Laboratorio</title>
</head>
<body>
    <h1>Equipos del Laboratorio</h1>

    <ul>
        @forelse($equipos as $equipo)
            <li>
                <strong>{{ $equipo->nombre }}</strong> (Nº Serie: {{ $equipo->numero_serie }})
                <br>
                Descripción: {{ $equipo->descripcion ?? 'Sin observaciones' }}
                <br>
                Ubicación: {{ $equipo->aula->nombre_sala }}
                <br>
                
                @if(!empty($equipo->imagen_ruta))
                    <img src="{{ asset($equipo->imagen_ruta) }}" alt="Foto del equipo" width="150" style="border: 1px solid #ccc; padding: 5px;">
                @else
                    <p><em>Sin fotografía cargada.</em></p>
                @endif
            </li>
        @empty
            <li>⚠️ No hay equipos registrados en el sistema actualmente.</li>
        @endforelse
    </ul>

    <hr>

    <h2>Registrar Nuevo Equipo</h2>
    <form action="{{ route('equipos.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        
        <div>
            <label>Nombre del Componente:</label>
            <input type="text" name="nombre" required>
        </div>
        <br>
        <div>
            <label>Número de Serie / Patrimonio:</label>
            <input type="text" name="numero_serie" required>
        </div>
        <br>
        <div>
            <label>Descripción / Detalles:</label>
            <textarea name="descripcion"></textarea>
        </div>
        <br>
        <div>
            <label>Asignar a un Aula:</label>
            <select name="aula_id" required>
                @foreach($aulas as $aula)
                    <option value="{{ $aula->id }}">{{ $aula->nombre_sala }}</option>
                @endforeach
            </select>
        </div>
        <br>
        <div>
            <label>Fotografía del Hardware:</label>
            <input type="file" name="foto_equipo" accept=".jpg, .png">
        </div>
        <br>
        <button type="submit">Guardar Equipo</button>
    </form>
</body>
</html>