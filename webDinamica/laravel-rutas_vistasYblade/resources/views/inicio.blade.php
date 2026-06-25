@extends('layouts.app')

@section('contenido')
    <h1>Bienvenido, {{ $alumno }}</h1>

    @if($esAdmin)
        <p>Tienes permisos de edición</p>
    @else
        <p>Modo de solo lectura</p>
    @endif
@endsection
