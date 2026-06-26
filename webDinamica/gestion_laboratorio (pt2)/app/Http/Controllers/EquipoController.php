<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipo; // Importación obligatoria para usar Eloquent
use App\Models\Aula; // Importación obligatoria para usar Eloquent

class EquipoController extends Controller
{
    public function index()
    {
        $equipos = Equipo::all();
        $aulas = Aula::all(); // Consultamos las aulas 
        return view('equipos.index', compact('equipos', 'aulas'));
    }

    public function store(Request $request)
    {
        $equipo = new Equipo();
        $equipo->nombre = $request->input('nombre');
        $equipo->numero_serie = $request->input('numero_serie');
        $equipo->descripcion = $request->input('descripcion');
        $equipo->aula_id = $request->input('aula_id'); // Capturamos el aula
        
        if ($request->hasFile('foto_equipo')) {
            $ruta = $request->file('foto_equipo')->store('public/hardware');
            $equipo->imagen_ruta = str_replace('public/', 'storage/', $ruta);
        }

        $equipo->save();
        return redirect()->route('equipos.index');
    }
}