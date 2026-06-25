@extends('layouts.app')

@section('contenido')
    <h1>Catálogo de Insumos</h1>
    <ul>
        @forelse($insumos as $insumo)
            <li>
                {{ $loop->iteration }}. 
                {{-- Creamos el link pasando el ID (usamos el $loop->iteration como ID de prueba) --}}
                <a href="{{ route('detalle.show', ['id' => $loop->iteration]) }}">
                    {{ $insumo['nombre'] }}
                </a> 
                - ${{ $insumo['precio'] }}
            </li>
        @empty
            <li>No hay insumos cargados en el sistema</li>
        @endforelse
    </ul>
@endsection
