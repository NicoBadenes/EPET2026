<?php

namespace App\Http\Controllers;

use App\Models\Equipo;
use App\Models\Aula;
use Illuminate\Http\Request;

class EquipoController extends Controller
{
    public function index()
    {
        // Recupera los equipos con sus aulas y la lista completa de aulas [cite: 32, 114]
        $equipos = Equipo::with('aula')->get();
        $aulas = Aula::all();
        return view('equipos.index', compact('equipos', 'aulas'));
    }

    public function store(Request $request)
    {
        $equipo = new Equipo();
        $equipo->nombre = $request->input('nombre'); [cite: 116]
        $equipo->numero_serie = $request->input('numero_serie'); [cite: 116]
        $equipo->descripcion = $request->input('descripcion'); [cite: 116]
        $equipo->aula_id = $request->input('aula_id'); // Vincula el dispositivo al aula

        // Módulo Multimedia: Captura y almacenamiento de la fotografía 
        if ($request->hasFile('foto_equipo')) { [cite: 60]
            $ruta = $request->file('foto_equipo')->store('public/hardware'); // Carpeta interna 
            $equipo->imagen_ruta = str_replace('public/', 'storage/', $ruta); // Ruta corregida para MySQL 
        }

        $equipo->save(); [cite: 116]

        return redirect()->route('equipos.index'); [cite: 116]
    }
}